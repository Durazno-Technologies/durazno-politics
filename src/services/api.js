import axios from 'axios';

export const getAncestors = async (role) => {
  try {
    const ancestors = await axios.get(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/ancestors/ids?query=${role}`,
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      },
    );
    return ancestors.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getMunicipalities = async () => {
  try {
    const municipalities = await axios.get(
      'https://mocki.io/v1/fc5f1a00-7d5c-476e-81f3-84d1fa5866ae',
    );
    return municipalities.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getDistricts = async () => {
  try {
    const districts = await axios.get('https://mocki.io/v1/8289a653-fce3-4651-8cdd-2dd8ff1f8eb4');
    return districts.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getAncestor = async (userId, jwt) => {
  try {
    const ancestor = await axios.get(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/ancestors/${userId}`,
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
          Authorization: 'Bearer ' + jwt,
        },
      },
    );
    return ancestor;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const createAncestor = async (ancestor) => {
  console.log(ancestor);
  try {
    const ancestorCreated = await axios.post(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/ancestors`,
      {
        id: ancestor.attributes.sub,
        name: ancestor.attributes.name,
        phone: ancestor.attributes.phone_number,
        email: ancestor.attributes.email,
        role: ancestor.attributes['custom:role'],
        ancestor: '',
        identifier: Math.floor(Math.random() * 9000 + 1000),
      },
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
          Authorization: 'Bearer ' + ancestor.signInUserSession.idToken.jwtToken,
        },
      },
    );
    return ancestorCreated;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const existsPhoneNumber = async (phoneNumber) => {
  try {
    const existsPhone = await axios.post(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/users/validatePhone`,
      {
        phoneNumber,
      },
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      },
    );
    return existsPhone.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const createUser = async (user) => {
  try {
    const userCreated = await axios.post(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/users`,
      {
        municipality: user.municipality,
        district: user.district,
        section: user.section,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        address: user.address,
        phoneNumber: user.phoneNumber,
        ine: user.ine,
        ancestor: user.ancestor,
      },
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      },
    );
    return userCreated;
  } catch (e) {
    console.log(e);
    return false;
  }
};
