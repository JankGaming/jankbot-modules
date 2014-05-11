#Wiki module for JankBot
By JankDota

To use this module, copy this directory into Jankbot's bot_modules/ directory.

Once installed, this module lets Jankbot maintain a proprietary wiki of info.

## Permissions

There are 4 levels of permissions for this module. Each user must be assigned
a permission in order to use this module beyond reading.

`create` lets a user author, edit and delete articles.

`append` lets a user append to or edit articles.

`edit` lets a user edit or delete articles.

`delete` lets a user delete articles.

By default, the any admin can give permissions by using the command: 
`wiki permission give PERMISSION_LEVEL USERNAME`

You can revoke permissions by using `wiki permission revoe PERMISSION_LEVEL USERNAME`