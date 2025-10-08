
const typeMotor = [
    {
        path: '/type-motor',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2]
        },
        children: [
            { 
                path: '', 
                name: 'type-motor-list', 
                component: () => import(/* webpackChunkName: "type-motor-list" */ '@/views/type_motor/index.vue'),
                meta: {
                    
                }
            },
            { 
                path: 'add', 
                name: 'type-motor-add', 
                component: () => import(/* webpackChunkName: "type-motor-add" */ '@/views/type_motor/add.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/view', 
                name: 'type-motor-view', 
                component: () => import(/* webpackChunkName: "type-motor-view" */ '@/views/type_motor/view.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/edit', 
                name: 'type-motor-edit', 
                component: () => import(/* webpackChunkName: "type-motor-view" */ '@/views/type_motor/edit.vue'),
                meta: {
                    
                }
            }
        ],
    }
]

export default typeMotor