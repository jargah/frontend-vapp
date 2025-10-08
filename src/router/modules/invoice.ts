
const invoice = [
    {
        path: '/invoice',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2,4]
        },
        children: [
            { 
                path: '', 
                name: 'invoice-list', 
                component: () => import(/* webpackChunkName: "invoice-list" */ '@/views/invoice/index.vue'),
                meta: {
                    
                }
            }
        ],
    }
]

export default invoice