# Medical-Clinic

Web Application built in Vuex with FireStore Database for a medical clinic, the app being secured and having protected routes.

! - - Describing how the app works - - !

In the moment you access the site, you will can see how our medical clinic can help our pacients if they need our help and our appointments history.
If a pacient wants to make a new appointment, he must register and login.

After login, a localstorage token will be registered and we will can see in any moment user's informations like: email, phone number, years old and name.
To make a new appointment, the pacient must choose a specialization he wants to go, and after that choose a free date from the calendar. If there are places available, he can choose one of them and submit. 

The pacient can cancel his unfinished appointments in any moment by cliking the remove button in his history list of appointments, or edit them.
If our pacient has a medical refferal, the price he needs to pay will be zero. If not, he will pay a tax for consulting. In pacient's appointments history, he can sort all the appoyntments by day and can filter them by specialization or price payd.

Also, the pacient can edit his personal data data in a special page.

! - - TECHNOLOGIES USED - - ! 

 - Vuex
 - NodeJs
 - Firebase
 - Express
 - JsonWebToken
 - Morgan
 - Cors
 - Faker



You can test my app here: https://medicalclinicvue.netlify.app/
