
const settings = [
    {
        path: '/settings',
        name: 'settings',
        component: () => import("@/views/settings/index.vue"),
        meta: { 
            public: true,
            layout: 'default-layout' 
        }
    }
]

export default settings