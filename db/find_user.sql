-- COMP 66C
select *
from users
where users.google_auth_id = $1;