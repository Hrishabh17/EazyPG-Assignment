# EazyPG
EazyPG Backend Internship Assignment

## Tech Stack
      Node.js : Application
      
      PostgreSQL : Database Dialect
      
      Firebase : Cloud Application Hosting
      
      Amazon RDS Postgres Engine : Cloud Database
      
## Endpoints List

  -   Signup Endpoint
      -   Post: /api/auth/signup  
#      
  -   Login Endpoint
      - Post: /api/auth/login
#  
  -   Get User Endpoint
      - Get: /api/users/:id
#   
  -   *Create Blog Post Endpoint
      - Post: /api/posts/
#   
  -   Get Blog Post By Id Endpoint
      - Get: /api/posts/:postId  
#  
  -   Get All Blog Post in Filtered, Ordered & Paginated manner Endpoint
      - Get: /api/posts/
      - Query Params: 
         - keywords: Array
         - content: String
         - authorId: UUID
         - category: String
         - page: Numeric
         - offset: Numeric
         - limit: Numeric
         - mostLike: Boolean
         - mostComment: Boolean
         - mostRecent: Boolean // Default    
#  
  -   *Update Blog Post By Id Endpoint
      - Put: /api/posts/:postId   
#  
  -   *Create Comment Endpoint
      - Post: /api/comments  
#  
  -   *Update Comment By Id Endpoint
      - Put: /api/comments/:commentId  
# 
  -   *Delete Comment By Id Endpoint
      - Delete: /api/comments/:commentId  
#  
  -   Get All Comments Endpoint
      - Get: /api/comments  
#  
  -   *Like Blog Post Endpoint
      - Post: /api/like   
# 
  -   *Unlike Blog Post Endpoint
      - Post: /api/unlike  
#  
  >   *denotes authorization required

## Project Directory Structure
      .
      ├── README.md
      ├── controllers
      │   ├── authController.js
      │   ├── commentController.js
      │   ├── likeController.js
      │   ├── postController.js
      │   └── userController.js
      ├── init.js
      ├── main.js
      ├── middlewares
      │   └── jwtCheck.js
      ├── models
      │   ├── commentsModel.js
      │   ├── keyPostModel.js
      │   ├── keywordsModel.js
      │   ├── likeModel.js
      │   ├── postModel.js
      │   └── userModel.js
      ├── package-lock.json
      ├── package.json
      ├── routes
      │   ├── authRoute.js
      │   ├── commentRoute.js
      │   ├── likeRoute.js
      │   ├── postRoute.js
      │   └── userRoute.js
      └── utils
          ├── associations.js
          └── database.js
         
## Instructions
      I. To run the application locally, run the init file and provide the following args:
        
        1. HostName
        2. User
        3. Password
        4. Database Name
        5. Port
        
      II. Start the Express Server
