/* 

    * This file is responsible for checking the visitor's face and showing the appropriate message. It will also be responsible for showing the visitor page, which will show a message saying that the visitor is recognized and will ask them to wait for the employee to grant access.

    * Visitor Conditions:
        * If the visitor is recognized, it will show a message saying that the visitor is recognized and will ask them to wait for the employee to grant access.
            * If the employee is recognized, it will show a message saying that the employee is recognized and will ask them to wait for the employee to grant access.
            * If the employee is not recognized, it will show a message saying that the employee is not recognized and will ask them to try again.
        * If the visitor is not recognized, it will show a message saying that the visitor is not recognized and will ask them to try again.
        * If the visitor is recognized due to:
            * Face not being detected: It will show a message saying that the face is not detected and will ask them to try again.
            * Face not in database: It will show a message saying "Welcome new visitor! Please wait for an employee to grant you access." and will ask them to wait for the employee to grant access.
            * Face in database: It will show a message saying "Welcome back visitor! Please wait for an employee to grant you access." and will ask them to wait for the employee to grant access.

*/