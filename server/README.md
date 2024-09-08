# Ticketing API

## Functionalities

```
Comprehensive custom Error Handling

User Authentication
User Functionsality
User signup and login
Greator signup and login
Events & Tickets
```

## Routes

[TICKETING_URL](http://localhost:5000/api/v1/)

### http://localhost:5000/api/v1/

## Users

```
/users/register Create a new user
/users/creator/register Create a new creator(has the ability to create an event)
/users/login Login as a registered user or creator
/users/user Show the current logged-in user
/users/logout Logout the current logged-in user
```

## Events & Tickets

```
/events/event Create a new event by a creator
/events/events Get all events created by a creator only
/events/events/:eventId Get a specific event by a user
/events Get all events created
/events/:eventId/tickets Book an event ticket created by a creator except the creator
```

## Screenshots

### Error Handling testing

![](../screenshots/postman_testing.png)

### Postman create user

![](../screenshots/create_user.png)

![](../screenshots/show_current_user.png)
![](../screenshots/create_new_event.png)
![](../screenshots/only_creator_events.png)
![](../screenshots/creator_can't_book_ticket.png)
