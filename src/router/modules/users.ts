
const users = [
    {
        path: '/users',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2]
        },
        children: [
            { 
                path: '', 
                name: 'users-list', 
                component: () => import(/* webpackChunkName: "users-list" */ '@/views/users/index.vue'),
                meta: {
                    
                }
            },
            { 
                path: 'add', 
                name: 'users-add', 
                component: () => import(/* webpackChunkName: "users-add" */ '@/views/users/add.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/view', 
                name: 'users-view', 
                component: () => import(/* webpackChunkName: "users-view" */ '@/views/users/view.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/edit', 
                name: 'users-edit', 
                component: () => import(/* webpackChunkName: "users-view" */ '@/views/users/edit.vue'),
                meta: {
                    
                }
            }
        ],
    }
]

export default users