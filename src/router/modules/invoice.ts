
const invoice = [
    {
        path: '/invoice',
        name: 'invoice',
        component: () => import("@/views/invoice/index.vue"),
        meta: { 
            public: true,
            layout: 'default-layout' 
        }
    }
]

export default invoice