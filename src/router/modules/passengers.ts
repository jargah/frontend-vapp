
const passengers = [
    {
        path: '/passengers',
        name: 'passengers',
        component: () => import("@/views/passengers/index.vue"),
        meta: { 
            public: true,
            layout: 'default-layout' 
        }
    }
]

export default passengers