# Permissions

## Users

### `user:read`

With this, a user has permission to view any user record.

### `user:update`

With this, a user has permission to edit any user record.

### `user:destroy`

With this, a user has permission to delete any user record.
This deletes any accounts or tokens associated with that
user record as well.

### `user:self:read`

With this, a user has permission to view her own user record.
Note that a user who has user:read can also view her own user
record, even if she does not have user:self:read. This is
only meaningful for users who do not have user:read.

### `user:self:update`

With this, a user has permission to make changes to her own
user record. Note that a user who has user:write can also
make changes to her own user record, even if she does not
have user:self:write. This is only meaningful for users who
do not have user:write.

### `user:self:destroy`

With this, a user has permission to delete her own user
record. Note that a user who has user:delete can also delete
her own user record, even if she does not have
user:self:delete. This is only meaningful for users who do
not have user:delete.

## Roles

### `role:x:grant`

For each role _x_, this gives the user the permission
to grant that role to herself or others. For example,
`role:admin:grant` gives the user the ability to grant the role
of `admin` to any user, including herself.

### `role:x:revoke`

For each role _x_, this gives the user the permission
to revoke that role from herself or others. For example,
`role:admin:revoke` gives the user the ability to revoke
the role of `admin` from any user, including herself.