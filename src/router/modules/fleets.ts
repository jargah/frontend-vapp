
const fleets = [
    {
        path: '/fleets',
        name: 'fleets',
        component: () => import("@/views/page.vue"),
        redirect: '',
        children: [
            {
                path: ':',
                name: 'fleets-list',
                component: () => import("@/views/fleets/index.vue"),
                meta: {
                    public: true,
                    layout: 'default-layout'
                }
            },
            {
                path: ':id/edit',
                name: 'fleets-edit',
                component: () => import("@/views/fleets/edit.vue"),
                meta: {
                    public: true,
                    layout: 'default-layout'
                }
            },
            {
                path: ':id/view',
                name: 'fleets-view',
                component: () => import("@/views/fleets/view.vue"),
                meta: {
                    public: true,
                    layout: 'default-layout'
                }
            }
        ]
    },
    {
        path: '/fleets/add',
        name: 'fleets-add',
        component: () => import("@/views/fleets/add.vue"),
        meta: {
            public: true,
            layout: 'default-layout'
        },
        
    },

]

export default fleets