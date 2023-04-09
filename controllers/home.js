const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Post, User, Comment } = require('../../models');

// get all posts for dashboard
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_date'],
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

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('dashboard', {
      layout: 'dashboard',
      posts,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one post
router.get('/posts/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_date'],
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
      layout: 'dashboard',
      post,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/comment/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id, {
      include: [
        {
          model: Post,
          attributes: ['title', 'content', 'created_date', 'user_id', 'id'],
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });

    const post = postData.get({ plain: true });
    const user = userData.get({ plain: true });
    
    res.render('edit-comment', {
      layout: 'dashboard',
      post,
      user,
      comment,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post', async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });

    const user = userData.get({ plain: true });

    res.render('new-post', {
      layout: 'dashboard',
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'content', 'created_date'],
        },
      ],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      layout: 'dashboard',
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/signup', (req, res) => {
  // If already logged in, redirect to homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

router.get('/login', (req, res) => {
  // If already logged in, redirect to homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;