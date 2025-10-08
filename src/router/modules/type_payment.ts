
const typePayment = [
    {
        path: '/type-payment',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2]
        },
        children: [
            { 
                path: '', 
                name: 'type-payment-list', 
                component: () => import(/* webpackChunkName: "type-payment-list" */ '@/views/type_payment/index.vue'),
                meta: {
                    
                }
            },
            { 
                path: 'add', 
                name: 'type-payment-add', 
                component: () => import(/* webpackChunkName: "type-payment-add" */ '@/views/type_payment/add.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/view', 
                name: 'type-payment-view', 
                component: () => import(/* webpackChunkName: "type-payment-view" */ '@/views/type_payment/view.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/edit', 
                name: 'type-payment-edit', 
                component: () => import(/* webpackChunkName: "type-payment-view" */ '@/views/type_payment/edit.vue'),
                meta: {
                    
                }
            }
        ],
    }
]

export default typePayment