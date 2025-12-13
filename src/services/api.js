// URL de tu API simulada (ajustar según tu actividad 1)
// Cambiar por la URL de tu JSON Server o API simulada
const API_BASE_URL = 'https://mock.apidog.com/m1/1069422-1057565-default';

// Si usas json-server en tu computadora, asegúrate de usar la IP de tu máquina
// En Android el localhost es 10.0.2.2
// const API_BASE_URL = 'http://10.0.2.2:3000';

/**
 * Obtener todos los libros
 */
export const fetchBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) {
      throw new Error('Error al obtener los libros');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

/**
 * Obtener un libro por ID
 */
export const fetchBookById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el libro');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

/**
 * Obtener espacios de co-working
 */
export const fetchCoWorkingSpaces = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/coworking`);
    if (!response.ok) {
      throw new Error('Error al obtener los espacios de co-working');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching co-working spaces:', error);
    throw error;
  }
};

/**
 * Obtener productos de la cafetería
 */
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('No se pudieron cargar los productos.');
  }
};


/**
 * Realizar reserva de espacio co-working
 */
export const bookCoWorkingSpace = async (reservationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) {
      throw new Error('Error al realizar la reserva');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error booking space:', error);
    throw error;
  }
};

export default {
  fetchBooks,
  fetchBookById,
  fetchProducts,
  fetchCoWorkingSpaces,
  bookCoWorkingSpace,
};
