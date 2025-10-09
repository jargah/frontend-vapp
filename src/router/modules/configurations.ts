
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
            
        ],
    }
]

export default configurations