<template>
    <v-row class="ga-4" align="stretch" no-gutters>
        <v-col cols="12" sm="6" md="4" class="h-100">
            <v-card class="metric-card h-100" rounded="xl" :elevation="elev"
                :class="[compact && 'is-compact', palette === 'gradient' && `bg-grad-${passengersColor}`]">
                <div class="metric-header">
                    <div class="metric-icon" :class="`ring-${passengersColor}`">
                        <v-icon :size="iconSize">mdi-account-group</v-icon>
                    </div>
                    <span class="metric-title">Pasajeros</span>
                </div>

                <div class="metric-body">
                    <div class="metric-value">{{ formatNumber(animated.passengers) }}</div>
                    <v-progress-linear :model-value="bar(passengers, passengersTarget)" :height="compact ? 5 : 6"
                        rounded />
                    <div class="metric-foot">
                        <span>Meta</span>
                        <span>{{ formatNumber(passengersTarget) }}</span>
                    </div>
                </div>
            </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="h-100">
            <v-card class="metric-card h-100" rounded="xl" :elevation="elev"
                :class="[compact && 'is-compact', palette === 'gradient' && `bg-grad-${driversColor}`]">
                <div class="metric-header">
                    <div class="metric-icon" :class="`ring-${driversColor}`">
                        <v-icon :size="iconSize">mdi-steering</v-icon>
                    </div>
                    <span class="metric-title">Conductores</span>
                </div>

                <div class="metric-body">
                    <div class="metric-value">{{ formatNumber(animated.drivers) }}</div>
                    <v-progress-linear :model-value="bar(drivers, driversTarget)" :height="compact ? 5 : 6" rounded />
                    <div class="metric-foot">
                        <span>Meta</span>
                        <span>{{ formatNumber(driversTarget) }}</span>
                    </div>
                </div>
            </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="h-100">
            <v-card class="metric-card h-100" rounded="xl" :elevation="elev"
                :class="[compact && 'is-compact', palette === 'gradient' && `bg-grad-${doneColor}`]">
                <div class="metric-header">
                    <div class="metric-icon" :class="`ring-${doneColor}`">
                        <v-icon :size="iconSize">mdi-check-circle</v-icon>
                    </div>
                    <span class="metric-title">Viajes Realizados</span>
                </div>

                <div class="metric-body">
                    <div class="metric-value">{{ formatNumber(animated.tripsDone) }}</div>
                    <div class="metric-badges">
                        <v-chip :size="compact ? 'x-small' : 'small'" color="success" variant="flat">
                            {{ completionRate.toFixed(1) }}% del total
                        </v-chip>
                    </div>
                </div>
            </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="h-100">
            <v-card class="metric-card h-100" rounded="xl" :elevation="elev"
                :class="[compact && 'is-compact', palette === 'gradient' && `bg-grad-${canceledColor}`]">
                <div class="metric-header">
                    <div class="metric-icon" :class="`ring-${canceledColor}`">
                        <v-icon :size="iconSize">mdi-cancel</v-icon>
                    </div>
                    <span class="metric-title">Viajes Cancelados</span>
                </div>

                <div class="metric-body">
                    <div class="metric-value">{{ formatNumber(animated.tripsCanceled) }}</div>
                    <div class="metric-badges">
                        <v-chip :size="compact ? 'x-small' : 'small'" :color="cancelRateColor" variant="flat">
                            {{ cancelRate.toFixed(1) }}% cancelación
                        </v-chip>
                    </div>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
    passengers: { type: Number, default: 0 },
    drivers: { type: Number, default: 0 },
    tripsDone: { type: Number, default: 0 },
    tripsCanceled: { type: Number, default: 0 },
    passengersTarget: { type: Number, default: 1000 },
    driversTarget: { type: Number, default: 200 },
    durationMs: { type: Number, default: 1200 },
    locale: { type: String, default: 'es-MX' },

    compact: { type: Boolean, default: false },
    palette: { type: String, default: 'gradient' },
    elev: { type: [Number, String], default: 8 },

    passengersColor: { type: String, default: 'primary' },
    driversColor: { type: String, default: 'info' },
    doneColor: { type: String, default: 'success' },
    canceledColor: { type: String, default: 'error' }
})

const iconSize = computed(() => (props.compact ? 24 : 28))

const animated = reactive({
    passengers: 0,
    drivers: 0,
    tripsDone: 0,
    tripsCanceled: 0
})

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }
function animateTo(key, to, duration) {
    const from = Number(animated[key]) || 0
    const delta = (Number(to) || 0) - from
    const start = performance.now()
    const step = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = easeOutCubic(t)
        animated[key] = Math.round(from + delta * eased)
        if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
}

watch(
    () => [props.passengers, props.drivers, props.tripsDone, props.tripsCanceled, props.durationMs],
    ([p, d, td, tc, dur]) => {
        animateTo('passengers', p, dur)
        animateTo('drivers', d, dur)
        animateTo('tripsDone', td, dur)
        animateTo('tripsCanceled', tc, dur)
    },
    { immediate: true }
)

const totalTrips = computed(() => (props.tripsDone || 0) + (props.tripsCanceled || 0))
const cancelRate = computed(() => totalTrips.value ? (props.tripsCanceled / totalTrips.value) * 100 : 0)
const completionRate = computed(() => totalTrips.value ? (props.tripsDone / totalTrips.value) * 100 : 0)
const cancelRateColor = computed(() => cancelRate.value < 5 ? 'success' : cancelRate.value < 12 ? 'warning' : 'error')

function formatNumber(n) {
    try { return new Intl.NumberFormat(props.locale).format(n ?? 0) } catch { return String(n ?? 0) }
}
function bar(value, target) {
    const v = Number(value) || 0
    const t = Number(target) || 1
    return Math.max(0, Math.min(100, Math.round((v / t) * 100)))
}
</script>

<style scoped>
.metric-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 180px;
    padding: 18px;
    border: 1px solid rgba(0, 0, 0, .06);
    background:
        radial-gradient(120% 140% at 100% 0%, rgba(125, 125, 125, 0.06) 0%, rgba(125, 125, 125, 0) 60%),
        linear-gradient(180deg, rgba(125, 125, 125, 0.05), rgba(125, 125, 125, 0.03));
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(0, 0, 0, .08);
    border-color: rgba(var(--v-theme-primary), .25);
}

.is-compact {
    padding: 14px;
    min-height: 150px;
}

/* Header */
.metric-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
}

.metric-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 999px;
    background: rgba(255, 255, 255, .35);
    border: 1px solid rgba(255, 255, 255, .4);
    backdrop-filter: saturate(140%) blur(3px);
}

.is-compact .metric-icon {
    width: 40px;
    height: 40px;
}

/* Ring color (utiliza rgb(var(--v-theme-*))) */
.ring-primary {
    border-color: rgba(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), .12);
}

.ring-success {
    border-color: rgba(var(--v-theme-success));
    background: rgba(var(--v-theme-success), .12);
}

.ring-warning {
    border-color: rgba(var(--v-theme-warning));
    background: rgba(var(--v-theme-warning), .12);
}

.ring-error {
    border-color: rgba(var(--v-theme-error));
    background: rgba(var(--v-theme-error), .12);
}

.ring-info {
    border-color: rgba(var(--v-theme-info));
    background: rgba(var(--v-theme-info), .12);
}

.ring-secondary {
    border-color: rgba(var(--v-theme-secondary));
    background: rgba(var(--v-theme-secondary), .12);
}

/* Titles / values */
.metric-title {
    font-weight: 700;
    opacity: .88;
}

.is-compact .metric-title {
    font-size: .95rem;
}

.metric-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.metric-value {
    font-weight: 900;
    font-size: clamp(22px, 3.1vw, 30px);
    line-height: 1.1;
    letter-spacing: .2px;
}

.is-compact .metric-value {
    font-size: clamp(20px, 2.6vw, 26px);
}

.metric-foot {
    display: flex;
    justify-content: space-between;
    font-size: .8rem;
    opacity: .75;
    margin-top: 2px;
}

.metric-badges {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.bg-grad-primary {
    background:
        radial-gradient(120% 140% at 100% 0%, rgba(var(--v-theme-primary), .20) 0%, rgba(var(--v-theme-primary), 0) 60%),
        linear-gradient(180deg, rgba(var(--v-theme-primary), .10), rgba(var(--v-theme-primary), .06));
}

.bg-grad-success {
    background:
        radial-gradient(120% 140% at 100% 0%, rgba(var(--v-theme-success), .20) 0%, rgba(var(--v-theme-success), 0) 60%),
        linear-gradient(180deg, rgba(var(--v-theme-success), .10), rgba(var(--v-theme-success), .06));
}

.bg-grad-warning {
    background:
        radial-gradient(120% 140% at 100% 0%, rgba(var(--v-theme-warning), .20) 0%, rgba(var(--v-theme-warning), 0) 60%),
        linear-gradient(180deg, rgba(var(--v-theme-warning), .10), rgba(var(--v-theme-warning), .06));
}

.bg-grad-error {
    background:
        radial-gradient(120% 140% at 100% 0%, rgba(var(--v-theme-error), .20) 0%, rgba(var(--v-theme-error), 0) 60%),
        linear-gradient(180deg, rgba(var(--v-theme-error), .10), rgba(var(--v-theme-error), .06));
}

.bg-grad-info {
    background:
        radial-gradient(120% 140% at 100% 0%, rgba(var(--v-theme-info), .20) 0%, rgba(var(--v-theme-info), 0) 60%),
        linear-gradient(180deg, rgba(var(--v-theme-info), .10), rgba(var(--v-theme-info), .06));
}

.bg-grad-secondary {
    background:
        radial-gradient(120% 140% at 100% 0%, rgba(var(--v-theme-secondary), .20) 0%, rgba(var(--v-theme-secondary), 0) 60%),
        linear-gradient(180deg, rgba(var(--v-theme-secondary), .10), rgba(var(--v-theme-secondary), .06));
}
</style>
