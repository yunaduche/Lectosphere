import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Booki, BookState, BookSearch } from './type/book';

const initialState: BookState = {
  formData: {
    isbn: '',
    titre: '',
    auteurs: '',
    editeurs: '',
    datePublication: '',
    nombrePages: '',
    langue: '',
    categorie: '',
    motsCle: '',
    description: '',
    urlPhoto: '',
    format: '',
    nombreExemplaires : 1,
  },
  isLoading: false,
  error: null,
  loading: false,
  message: null,
  books: [],
};

export const fetchBookByISBN = createAsyncThunk<Partial<Booki>, string, { rejectValue: string }>(
  'book/fetchByISBN',
  async (isbn, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${9782364526778}`);
      if (response.data.items && response.data.items.length > 0) {
        const bookInfo = response.data.items[0].volumeInfo;
        return {
          isbn,
          titre: bookInfo.title || '',
          auteurs: bookInfo.authors ? bookInfo.authors.join(', ') : '',
          editeurs: bookInfo.publisher || '',
          datePublication: bookInfo.publishedDate ? bookInfo.publishedDate.split('-')[0] : '',
          nombrePages: bookInfo.pageCount ? bookInfo.pageCount.toString() : '',
          langue: bookInfo.language || '',
          categorie: bookInfo.categories ? bookInfo.categories[0] : '',
          urlPhoto: bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : '',
          description: bookInfo.description || '',
        };
      }
      return rejectWithValue('Aucune information trouvée pour cet ISBN.');
    } catch (error) {
      return rejectWithValue('Erreur lors de la récupération des données. Veuillez réessayer.');
    }
  }
);

export const addBook = createAsyncThunk<Booki, Booki, { rejectValue: string }>(
  'book/addBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ message: string; book: Booki }>('/api/books/add', bookData);
      return response.data.book;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Erreur lors de l\'ajout du livre.');
      }
      return rejectWithValue('Erreur lors de l\'ajout du livre.');
    }
  }
);

export const addExemplaire = createAsyncThunk<void, string, { rejectValue: string }>(
  'book/addExemplaire',
  async (isbn, { rejectWithValue }) => {
    try {
      await axios.post('/api/books/add-exemplaire', { isbn });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Erreur lors de l\'ajout de l\'exemplaire.');
      }
      return rejectWithValue('Erreur lors de l\'ajout de l\'exemplaire.');
    }
  }
);

export const fetchBooks = createAsyncThunk('/api/books', async () => {
  const response = await axios.get<Booki[]>('/api/books/all');
  return response.data;
});

export const searchBooks = createAsyncThunk('books/books', 
  async (searchCriteria: BookSearch) => {
    const response = await axios.get<Booki[]>('/api/books/search', { params: searchCriteria });
    return response.data;
  }
);

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    updateFormField: (state, action: PayloadAction<{ field: keyof Booki; value: string }>) => {
      state.formData[action.payload.field] = action.payload.value;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookByISBN.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookByISBN.fulfilled, (state, action) => {
        state.isLoading = false;
        state.formData = { ...state.formData, ...action.payload };
      })
      .addCase(fetchBookByISBN.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Une erreur est survenue';
      })
      .addCase(addBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = { type: 'success', content: 'Livre enregistré avec succès!' };
        state.formData = initialState.formData;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Une erreur est survenue';
      })
      .addCase(addExemplaire.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addExemplaire.fulfilled, (state) => {
        state.isLoading = false;
        state.message = { type: 'success', content: 'Nouvel exemplaire ajouté avec succès!' };
      })
      .addCase(addExemplaire.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Une erreur est survenue lors de l\'ajout de l\'exemplaire';
      })
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Booki[]>) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action: PayloadAction<Booki[]>) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue lors de la recherche';
      });
  },
});

export const { updateFormField, resetForm } = bookSlice.actions;
export default bookSlice.reducer;