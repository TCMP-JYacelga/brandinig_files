# Guides you through creating new theme on current FCM and new UI/UX
# Section 1: Installations
# Section 1: Guidelines to Create a new theme for the current FCM
# section 2: Guidelines to applying the new theme created on the new UI/UX

Installations required:
Node js and SASS are required to be installed.

Guidelines to Create a new theme for the current FCM
    Folder structure:
    1. resources/images contains the images used in the UI. Can be changed for every theme
       T7UX folder explicitly contains the images used in the new UI/UX.
    2. _custom.scss is used in overriding the bootstrap variables and generating the source code required for the new UI/UX.
    3. Overwrite.scss file is used to override the styles for existing FCM
    4. OverwriteUX.scss file is used to override the styles for new UI/UX
    5. t7-dashboard*.css is used in the new UI/UX 
    6. t7*.css is used in the existing FCM

    Key points:
    1. folders with t7- are used for themeing on client
    2. Changes in the scss files in base-theme folder should be avoided since it requires compilation of scss for all the themes importing it.


    Database tables used:
    1. UI_THEME_LINKAGE
    2. UI_THEME_MST      
    3. CLIENT_GROUP_MST  --- entry in this table will add new dropdown value in the client set up where the client can choose the theme like Gold, silver etc

    Steps to be followed:
    1. Make the DB entries in the above mentioned tables according to the new theme to be created
    2. Follow the same structure as for t7-main folder
    3. change the variables present in t7-<theme_created>.scss as required 
    4. compile it with the below command in the termianl containing the new theme folder which generates t7-<theme_created>.css
       sass t7-<theme_created>.scss t7-<theme_created>.css
    5. Any class can be overriden in the file overwrite.scss 

Guidelines to applying the new theme created on the new UI/UX
    involves generating bootstrap-material-design-min.css and t7-dashboard*.css
    
    Generating bootstrap-material-design-min.css
    Bootrstrap source code is included in the base-theme folder through which the bootstrap files can be generated
    Every theme in new UI/UX has a primary color and secondary color. To generate the bootstrap css with these colors,
    1. mention the colors in _custom.scss in the respective theme folder.
    2. install the dev dependencies mentioned in package.json by running the below command in the path containing package.json.(\gcpng\cashweb\web\static\Themes\base-theme\bootstrap-material-design-4.1.3)
        npm install
    3. change the below two paths as required in package.json.
        "config": {
            "minfilepath" : "../../t7-440green/bootstrap-material-design.min.css",
            "customscsspath": "../../t7-440green/SASS/_custom.scss" 
        }
        minfilepath -   is the path in which the css file is generated after following the step 4
        customscsspath - is the path from which the _custom.scss is picked and copies to bootstrap source code to generate the css accordingly
    4. run the below command to generate the css min file in the path mentioned in  "minfilepath" in step 3
       npm run build:cssmin

    Generating t7-dashboard*.css
    1. change the variables present in t7-dashboard*.scss as required 
    2. compile it with the below command in the termianl containing the new theme folder which generates t7-<theme_created>.css
       sass t7-dashboard-<theme_created>.scss t7-dashboard-<theme_created>.css
    3. Any class can be overriden in the file overwriteUX.scss 

       
