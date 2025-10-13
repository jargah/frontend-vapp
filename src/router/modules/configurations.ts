
const configurations = [
    {
        path: '/configurations',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2,3]
        },
        children: [
            { 
                path: 'commissions', 
                name: 'config-commissions', 
                component: () => import(/* webpackChunkName: "config-commissions" */ '@/views/commissions_fees/index.vue'),
            },
            { 
                path: 'normal-rates', 
                name: 'config-normal-rates', 
                component: () => import(/* webpackChunkName: "config-normal-rates" */ '@/views/normal_rates/index.vue'),
            },
            { 
                path: 'executive-rates', 
                name: 'config-executive-rates',
                component: () => import(/* webpackChunkName: "config-executive-rates" */ '@/views/executive_rates/index.vue'),
            },
            { 
                path: 'daily-rates', 
                name: 'config-daily-rates', 
                component: () => import(/* webpackChunkName: "config-daily-rates" */ '@/views/daily_rates/index.vue'),
            },
        ],
    }
]

export default configurations