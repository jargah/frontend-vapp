
const passengers = [
    {
        path: '/passengers',
        component: () => import('@/views/page.vue'),
        meta: { public: false, layout: 'default-layout' },
        children: [
            { path: '', name: 'passengers-list', component: () => import('@/views/passengers/index.vue') },
            { path: 'add', name: 'passengers-add', component: () => import('@/views/passengers/add.vue') },
            { path: ':id/view', name: 'passengers-view', component: () => import('@/views/passengers/view.vue') },
            { path: ':id/edit', name: 'passengers-edit', component: () => import('@/views/passengers/edit.vue') },
        ],
    }
]

export default passengers