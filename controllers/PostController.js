import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
   try {
      const posts = await PostModel.find().limit(5).exec();

      const tags = posts
         .map((obj) => obj.tags)
         .flat()
         .slice(0, 5);

      res.json(tags);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить статьи',
      });
   }
};

export const getAll = async (req, res) => {
   try {
      const posts = await PostModel.find()
         .populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
         .exec();
      res.json(posts);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить статьи',
      });
   }
};

export const getOne = async (req, res) => {
   try {
      const postId = req.params.id;

      const post = await PostModel.findById(postId).populate('user').exec();
      if (!post) {
         return res.status(404).json({
            message: 'Статья не найдена.',
         });
      }

      res.json(post);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить статью',
      });
   }
};

export const remove = async (req, res) => {
   try {
      const postId = req.params.id;

      const deletedPost = await PostModel.findByIdAndDelete(postId).exec();
      if (!deletedPost) {
         return res.status(404).json({
            message: 'Статья не найдена.',
         });
      }

      res.json({
         success: true,
      });
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         message: 'Не удалось удалить статью',
      });
   }
};

export const create = async (req, res) => {
   try {
      const { title, text, imageUrl, tags, documentUrl } = req.body;

      const doc = new PostModel({
         title,
         text,
         imageUrl,
         tags: tags ? tags.split(',') : [],
         documentUrl, // Добавлено сохранение URL загруженного документа
         user: req.userId,
      });

      const post = await doc.save();

      res.json(post);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось создать статью',
      });
   }
};

export const update = async (req, res) => {
   try {
      const postId = req.params.id;

      const { title, text, imageUrl, tags, documentUrl } = req.body;

      await PostModel.findByIdAndUpdate(postId, {
         title,
         text,
         imageUrl,
         tags: tags ? tags.split(',') : [],
         documentUrl, // Обновление URL загруженного документа
         user: req.userId,
      }).exec();

      res.json({
         success: true,
      });
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         message: 'Не удалось обновить статью',
      });
   }
};
