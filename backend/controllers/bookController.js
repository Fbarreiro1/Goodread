import asyncHandler from '../middleware/asyncHandler.js';
import Book from '../models/bookModel.js'; 

// @desc    Obtener todos los libros
// @route   GET /api/books
// @access  Público
const getBooks = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Book.countDocuments({ ...keyword });
  const books = await Book.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ books, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Obtener un solo libro
// @route   GET /api/books/:id
// @access  Público
const getBookById = asyncHandler(async (req, res) => {
  // NOTA: la validación del ObjectId válido para prevenir CastError se ha movido a un middleware separado. Ver README para más información.

  const book = await Book.findById(req.params.id);
  if (book) {
    return res.json(book);
  } else {
    // NOTA: Esto se ejecutará si se recibe un ObjectId válido pero no se encontró ningún libro, es decir, el libro puede ser nulo
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Crear un libro
// @route   POST /api/books
// @access  Privado/Administrador
const createBook = asyncHandler(async (req, res) => {
  const book = new Book({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    author: 'Sample author', // Cambio de brand a author
    genre: 'Sample genre', // Cambio de category a genre
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Actualizar un libro
// @route   PUT /api/books/:id
// @access  Privado/Administrador
const updateBook = asyncHandler(async (req, res) => {
  const { name, price, description, image, author, genre, countInStock } =
    req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.name = name;
    book.price = price;
    book.description = description;
    book.image = image;
    book.author = author; // Cambio de brand a author
    book.genre = genre; // Cambio de category a genre
    book.countInStock = countInStock;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Eliminar un libro
// @route   DELETE /api/books/:id
// @access  Privado/Administrador
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await Book.deleteOne({ _id: book._id });
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Crear una nueva reseña
// @route   POST /api/books/:id/reviews
// @access  Privado
const createBookReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Book already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    book.reviews.push(review);

    book.numReviews = book.reviews.length;

    book.rating =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length;

    await book.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Obtener los libros mejor valorados
// @route   GET /api/books/top
// @access  Público
const getTopBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({}).sort({ rating: -1 }).limit(3);

  res.json(books);
});

export {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
  getTopBooks,
};
