
const { nanoid } = require("nanoid");
const books = require("./books");

const addBooksHandler = (request, h) => {
  const {
    name,
    author,
    year,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (!(name === undefined) && !(readPage > pageCount)) {
    books.push(newBook);
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const filterName = (bookList, queryName) => bookList.filter(
  (book) => book.name.toLowerCase().includes(queryName.toLowerCase()),
);

const filterReading = (bookList, queryReading) => {
  if (queryReading === '1') {
    return bookList.filter((book) => book.reading === true);
  } if (queryReading === '0') {
    return bookList.filter((book) => book.reading === false);
  }
  return bookList;
};

const filterFinished = (bookList, queryFinished) => {
  if (queryFinished === '1') {
    return bookList.filter((book) => book.finished === true);
  } if (queryFinished === '0') {
    return bookList.filter((book) => book.finished === false);
  }
  return bookList;
};

const getAllBooksHandler = (request, h) => {
  let bookList = books;

  const { name: queryName, reading: queryReading, finished: queryFinished } = request.query;

  if (queryName !== undefined) {
    bookList = filterName(bookList, queryName);
  }

  if (queryReading !== undefined) {
    bookList = filterReading(bookList, queryReading);
  }

  if (queryFinished !== undefined) {
    bookList = filterFinished(bookList, queryFinished);
  }

  bookList = bookList.map((book) => {
    const { id, name, publisher } = book;
    return { id, name, publisher };
  });

  const response = h.response({
    status: 'success',
    data: {
      books: bookList,
    },
  });
  response.code(200);
  return response;
};

const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    author,
    year,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }


if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      author,
      year,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};