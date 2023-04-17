const router = require('express').Router();;
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const withAuth = require('../utils/auth');

router.get('/dashboard', withAuth, async (req, res) => {


  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post },{ model: Comment  }],
    });

    const postData = await Post.findAll({
      include: [{ model: Comment  }],
      raw: true
    }
      );

      console.log("check???", postData );

    const user = userData.get({ plain: true });

    for(let i = 0; i < user.posts.length; i++){
      for(let j = 0; j < user.comments.length; j++){
      
        if( user.posts[i].id == user.comments[j].post_id){

          if( user.posts[i].comments == undefined){
            user.posts[i].comments = [user.comments[j]]
          } else {
            user.posts[i].comments.push(user.comments[j]) 
          }
        
        }

      }
     
    } //end of loop

    res.render('dashboard', {
      ...user,
      posts: postData,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
