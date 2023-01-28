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
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/municipalities`,
      {
        headers: {
          Accept: '*/*',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      },
    );
    return municipalities.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getDistricts = async () => {
  try {
    const districts = await axios.get(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/districts`,
      {
        headers: {
          Accept: '*/*',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      },
    );
    return districts.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getAncestor = async (ancestorId, jwt) => {
  try {
    const ancestor = await axios.get(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/ancestors/${ancestorId}`,
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
  try {
    const ancestorCreated = await axios.post(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/ancestors`,
      {
        id: ancestor.attributes.sub,
        name: ancestor.attributes.name,
        phone: ancestor.attributes.phone_number,
        email: ancestor.attributes.email,
        role: ancestor.attributes['custom:role'],
        ancestor: ancestor.attributes['custom:ancestorId'] || '',
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

export const createLead = async (lead) => {
  try {
    const leadCreated = await axios.post(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/leads`,
      {
        municipality: lead.municipality,
        district: lead.district,
        section: lead.section,
        firstName: lead.firstName,
        lastName: lead.lastName,
        middleName: lead.middleName,
        address: lead.address,
        phoneNumber: lead.phoneNumber,
        ine: lead.ine,
        ancestor: lead.ancestor,
        type: lead.type,
        lonaPicture: lead.lonaPicture,
        inePicture: lead.inePicture,
        bardaPicture: lead.bardaPicture,
        peopleVoting: lead.peopleVoting,
      },
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
          Authorization: 'Bearer ' + lead.jwt,
        },
      },
    );
    return leadCreated;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getLeads = async (jwt, typeLead) => {
  console.log(typeLead);
  try {
    const leads = await axios.get(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/leads/download?type=${typeLead}`,
      {
        headers: {
          Accept: '*/*',
          'x-api-key': process.env.REACT_APP_API_KEY,
          Authorization: 'Bearer ' + jwt,
        },
      },
    );
    return leads;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const updateAncestor = async (municipality, ancestorId, jwt) => {
  try {
    const ancestorUpdated = await axios.put(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/ancestors/${ancestorId}`,
      {
        municipality,
      },
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
          Authorization: 'Bearer ' + jwt,
        },
      },
    );
    return ancestorUpdated.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getAncestorMunicipality = async (jwt) => {
  try {
    const municipality = await axios.get(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/ancestors/upline?property=municipality`,
      {
        headers: {
          Accept: '*/*',
          'x-api-key': process.env.REACT_APP_API_KEY,
          Authorization: 'Bearer ' + jwt,
        },
      },
    );
    return municipality.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const uploadFile = async (fileName, fileType, jwt) => {
  try {
    const uploadedFile = await axios.post(
      `${process.env.REACT_APP_AMAZON_URL}/${process.env.REACT_APP_STAGE}/leads/upload`,
      {
        fileName,
        fileType,
      },
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
          Authorization: 'Bearer ' + jwt,
        },
      },
    );
    return uploadedFile.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};
