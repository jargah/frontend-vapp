
const vehicles = [
    {
        path: '/vehicles',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2]
        },
        children: [
            { 
                path: '', 
                name: 'vehicles-list', 
                component: () => import(/* webpackChunkName: "vehicles-list" */ '@/views/vehicles/index.vue'),
                meta: {
                    
                }
            },
            { 
                path: 'add', 
                name: 'vehicles-add', 
                component: () => import(/* webpackChunkName: "vehicles-add" */ '@/views/vehicles/add.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/view', 
                name: 'vehicles-view', 
                component: () => import(/* webpackChunkName: "vehicles-view" */ '@/views/vehicles/view.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/edit', 
                name: 'vehicles-edit', 
                component: () => import(/* webpackChunkName: "vehicles-view" */ '@/views/vehicles/edit.vue'),
                meta: {
                    
                }
            }
        ],
    }
]

export default vehicles