
const fleets = [
    {
        path: '/fleets',
        name: 'fleets',
        component: () => import("@/views/fleets/index.vue"),
        meta: { 
            public: true,
            layout: 'default-layout' 
        }
    }
]

export default fleets