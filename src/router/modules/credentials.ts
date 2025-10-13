
const credentials = [
    {
        path: '/credentials',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2,3]
        },
        children: [
            { 
                path: '', 
                name: 'credentials-list', 
                component: () => import(/* webpackChunkName: "credentials-list" */ '@/views/credentials/index.vue'),
                meta: {
                    
                }
            },
   
        ],
    }
]

export default credentials