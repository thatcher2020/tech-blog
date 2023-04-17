const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const withAuth = require ("../../utils/auth");

router.get(':id', withAuth, async (req, res) => {
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

    const posts = postData.get({ plain: true });



    res.render('dashboard', {
      posts,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {

  console.log("check?", req.body)


  try {
    const postData = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.redirect("/dashboard");

  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update({
      ...req.body,
      user_id: req.session.user_id,
    },
    {
      where: {
        id: req.params.id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/delete', withAuth, async (req, res) => {

  console.log("delete id", req.query.id)

  try {
    const postData = await Post.destroy({
      where: {
        id: req.query.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json(err);
  }



});


module.exports = router;
