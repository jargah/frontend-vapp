
const operators = [
    {
        path: '/operators',
        name: 'operators',
        component: () => import("@/views/operators/index.vue"),
        meta: { 
            public: true,
            layout: 'default-layout' 
        }
    }
]

export default operators