-- COMP 66G
insert into users
(first_name, last_name, email, avatar_img, google_auth_id)
values
($1,$2,$3,$4,$5)
returning *;