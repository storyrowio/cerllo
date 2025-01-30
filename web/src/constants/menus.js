import {GenerateUniqueId} from "utils/helper";
import {FlowCircleIcon, Home01Icon, UserGroupIcon, Vynil02Icon} from "hugeicons-react";

export const DefaultAppMenus = [
    {
        id: GenerateUniqueId(),
        title: 'Dashboard',
        icon: Home01Icon,
        href: '',
    },
    {
        id: GenerateUniqueId(),
        title: 'Users',
        icon: UserGroupIcon,
        permissions: ['user:read', 'user:create'],
        paths: ['/user', '/user/create', '/user/:id/update'],
        children: [
            {
                id: GenerateUniqueId(),
                title: 'List Users',
                href: '/user'
            },
            {
                id: GenerateUniqueId(),
                title: 'Create User',
                href: '/user/create'
            }
        ]
    },
    {
        id: GenerateUniqueId(),
        title: 'All Songs',
        icon: Vynil02Icon,
        href: '/song',
        // roles: [Roles.admin]
    },
    {
        sectionTitle: 'My Library',
        // roles: [Roles.admin],
    },
];
