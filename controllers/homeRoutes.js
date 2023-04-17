const router = require('express').Router();
const { Post, Comment, User } = require('../models');
const withAuth = require ('../utils/auth');

router.get('/', withAuth, async (req, res) => {


    if (req.session.logged_in) {
      res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }



});

// get one post
router.get('/posts/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: ['id', 'content', 'post_id', 'user_id', 'created_date'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('edit-post', {
      ...post,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render("post", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If already logged in, redirect to homepage
  if (req.session.loggedIn) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/profile', async(req, res) => {
  try {
    const userData = await User.findOne({ where: { id: req.session.user_id } });

    res.render('profile', {
      ...userData.get({ plain: true })
    })
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;