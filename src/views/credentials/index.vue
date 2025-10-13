<template>
    <v-container fluid class="py-6">
        <div class="d-flex align-center justify-space-between mb-4 ga-3">
            <h1 class="text-h5 mb-0">Credenciales</h1>
        </div>

        <template v-if="!credentials">
            <v-card rounded="xl" elevation="8">
                <v-skeleton-loader type="card"></v-skeleton-loader>
            </v-card>
        </template>

        <template v-else>
            <v-card rounded="xl" elevation="8">
                <Form @submit="onSubmit" v-slot="{ isSubmitting, values }">
                    <v-card-text>
                        <v-row dense>
                            <v-col
                                cols="12"
                                md="6"
                                v-for="item in credentials"
                                :key="item.id"
                            >
                                <TextField
                                    :label="item.label"
                                    :name="item.name"
                                    :model="item.value"
                                    :type="'text'"
                                  
                                />
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions class="justify-end">
                        <v-btn
                            color="primary"
                            :loading="isSubmitting"
                            :disabled="isSubmitting"
                            type="submit"
                            variant="outlined"
                            prepend-icon="mdi-content-save-outline"
                        >
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </Form>
            </v-card>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { Form } from "vee-validate";
import TextField from "@/components/form/textField.vue";

const store = useStore();
const credentials = computed(() => store.getters["credentials/credentials"]);
const saving = ref(false);

const loadData = async () => {
    await store.dispatch("credentials/list");
};

onMounted(() => loadData());

const onSubmit = async (values) => {
    try {
        const payload = [];
        for (const key in values) {
            const id = credentials.value.find((item) => item.name === key)?.id;

            payload.push({
                id,
                value: values[key],
            });
        }
        console.log(payload);

        await store.dispatch("credentials/edit", { fields: payload });
    } catch (e: any) {
        saving.value = false;
    } finally {
        saving.value = false;
    }
};
</script>
