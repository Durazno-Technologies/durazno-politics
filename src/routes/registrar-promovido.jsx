import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Select from 'react-select';
import ClipLoader from 'react-spinners/ClipLoader';
import { getMunicipalities, getDistricts, getAncestor, createLead } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Input from 'react-phone-number-input/input';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Header from '../components/Header';
import 'react-toastify/dist/ReactToastify.css';

const RegistrarPromovido = () => {
  const { authStatus, user } = useAuthenticator((context) => [context.authStatus]);
  const { route } = useAuthenticator((context) => [context.route]);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumberError, setPhoneError] = useState('');
  const [municipalities, setMunicipalities] = useState('');
  const [municipalityDistricts, setMunicipalityDistricts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState({});
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState({});
  const [hasErrors, setHasErrors] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState({});
  const [userInfo, setUserInfo] = useState({});

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
  });
  const onSubmit = async (data) => {
    const { fields } = { fields: data };

    let led = {
      municipality: selectedMunicipality.value,
      district: selectedDistrict.districtNumber,
      section: selectedSection.value,
      address: fields.location.label.toUpperCase(),
      phoneNumber: fields.phoneNumber ? fields.phoneNumber.slice(3) : undefined,
      peopleVoting: fields.peopleVoting,
      type: 'Promovido',
      ancestor: userInfo.identifier,
      jwt: user.signInUserSession.idToken.jwtToken,
    };

    try {
      setIsLoading(true);

      await createLead(led);
      reset({
        municipality: municipalities[0],
        district: districts[0],
        section: sections[0],
        phoneNumber: '',
        location: '',
        electorIdentifier: '',
      });
      setIsLoading(false);
      toast.success('Promovido agregado correctamente!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (e) {
      setIsLoading(false);
      toast.error('Hubo un error agregando al promovido, favor de intentar más tarde', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  useEffect(() => {
    let ignore = false;

    const getMunicipalitiesData = async () => {
      let municipalities = await getMunicipalities();
      if (!municipalities) {
        console.log(municipalities);
        setHasErrors(true);
      } else {
        if (!ignore) {
          municipalities = municipalities
            .map((municipality) => ({
              ...municipality,
              label: municipality.name,
              value: municipality.name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          setMunicipalities(municipalities);
        }
      }

      setIsLoading(false);
    };

    if (authStatus === 'authenticated') {
      setIsLoading(true);
      //getAncestorsData();
      getMunicipalitiesData();
      setIsLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [authStatus]);

  useEffect(() => {
    if (authStatus === 'configuring' && route === 'setup') {
      navigate('/');
    }
  }, [authStatus, route]);

  useEffect(() => {
    const getDistrictsData = async (municipality) => {
      let districtsData = await getDistricts();
      if (!districtsData) {
        setHasErrors(true);
      } else {
        districtsData = districtsData.map((district) => ({
          ...district,
          label: district.districtNumber,
          value: district.districtNumber,
        }));

        setDistricts(districtsData);
        let municipalityDistrictsData = districtsData.filter(
          (district) => municipality.districtIds.indexOf(district.id) >= 0,
        );
        setMunicipalityDistricts(municipalityDistrictsData);
        setSelectedDistrict(municipalityDistrictsData[0]);
        let sectionsData = municipalityDistrictsData[0].sections.map((section) => ({
          label: section,
          value: section,
        }));
        setSections(sectionsData);
        setSelectedSection(sectionsData[0]);
      }
    };

    const getAncestorData = async () => {
      const { data: ancestorInfo } = await getAncestor(
        user.attributes.sub,
        user.signInUserSession.idToken.jwtToken,
      );
      setUserInfo(ancestorInfo);
      let ancestorMunicipality = municipalities.filter(
        (municipality) => municipality.name === ancestorInfo.municipality,
      )[0];
      setSelectedMunicipality(ancestorMunicipality);
      await getDistrictsData(ancestorMunicipality);
    };

    if (user && municipalities.length > 0) {
      getAncestorData();
    }
  }, [user, municipalities]);

  const isAvailable = async (phoneNumber) => {
    if (!phoneNumber) return true;
    if (isValidPhoneNumber(phoneNumber)) {
      return true;
    } else {
      setPhoneError('Favor de ingresar un número valido');
      return false;
    }
  };

  const isValidElectorIdentifier = (electorIdentifier) => {
    if (electorIdentifier.length !== 18) {
      return false;
    } else {
      electorIdentifier = electorIdentifier.toUpperCase();
      const regex = /\b[A-Z]{6}[0-9]{8}[A-Z]{1}[0-9]{3}/;
      return regex.test(electorIdentifier);
    }
  };

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <ClipLoader color={'#96272d'} size={50} aria-label='Loading Spinner' data-testid='loader' />
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className='h-screen flex justify-center'>
        <p className='mt-12 text-pink-800 text-bold'>
          Tenemos errores comunicándonos con el servidor 😐 , favor de intentar más tarde
        </p>
      </div>
    );
  }

  if (authStatus === 'configuring') {
    return (
      <div className='h-screen flex justify-center items-center'>
        <ClipLoader color={'#96272d'} size={50} aria-label='Loading Spinner' data-testid='loader' />
      </div>
    );
  }

  return (
    <>
      {authStatus !== 'authenticated' || user.attributes['custom:role'] === 'Dirigente' ? (
        <Navigate to='/' />
      ) : (
        <>
          <div className='container mt-8 mb-8 pb-8 bg-white rounded-md  pt-6 h-auto'>
            <Header />

            <ToastContainer />
            <h1 className='mt-8 text-orange-900 font-extrabold text-xl text-center'>
              #VamosConDelfina
            </h1>
            <h3 className='text-red-800	font-extrabold text-lg text-center mt-2'>Registro</h3>
            <form
              className='container max-w-xl mb-12 py-10 mt-10 px-4 border'
              onSubmit={handleSubmit(onSubmit)}
            >
              {Object.keys(selectedMunicipality).length > 0 && (
                <>
                  <div className='flex align-center justify-start'>
                    <span className='flex items-center text-pink-800 text-sm font-bold'>
                      Municipio:
                    </span>
                    <span className='bg-pink-800 ml-2 px-2 py-2 text- font-bold text-white text-sm '>
                      {selectedMunicipality.name}
                    </span>
                  </div>
                </>
              )}

              {municipalityDistricts.length > 0 && (
                <div className='mt-4'>
                  <label className='text-gray-600 font-medium'>
                    Distrito <span className='text-red-600'>*</span>
                  </label>
                  <Controller
                    name='district'
                    control={control}
                    defaultValue={municipalityDistricts[0]}
                    render={({ field }) => {
                      return (
                        <Select
                          options={municipalityDistricts}
                          onChange={(val) => {
                            let newDistrict = districts.filter(
                              (district) => district.id === val.id,
                            )[0];
                            setSelectedDistrict(newDistrict);
                            let newSections = newDistrict.sections.map((section) => ({
                              label: section,
                              value: section,
                            }));
                            setSections(newSections);
                            setSelectedSection(newSections[0]);
                            field.onChange(val);
                          }}
                          isSearchable={true}
                          value={selectedDistrict}
                        />
                      );
                    }}
                  />
                </div>
              )}

              {sections.length > 0 && (
                <div className='mt-4'>
                  <label className='text-gray-600 font-medium'>
                    Sección <span className='text-red-600'>*</span>
                  </label>
                  <Controller
                    name='section'
                    control={control}
                    defaultValue={sections[0]}
                    render={({ field }) => (
                      <Select
                        options={sections}
                        onChange={(val) => {
                          setSelectedSection(
                            sections.filter((section) => section.value === val.value)[0],
                          );
                          field.onChange(val);
                        }}
                        isSearchable={true}
                        value={selectedSection}
                      />
                    )}
                  />
                </div>
              )}

              <div className='mt-4'>
                <label htmlFor='phoneNumber' className='text-gray-600 font-medium'>
                  Teléfono <span className='text-red-600 text-xs'>(Opcional)</span>
                </label>
                <Controller
                  name='phoneNumber'
                  control={control}
                  rules={{
                    validate: (value) => isAvailable(value),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      value={value}
                      onChange={onChange}
                      country='MX'
                      id='phoneNumber'
                      className='border-solid border-gray-300 border p-2  w-full rounded text-gray-700'
                    />
                  )}
                />
                {errors['phoneNumber'] && (
                  <div className='mb-3 text-normal text-red-500'>{phoneNumberError}</div>
                )}
              </div>

              <div className='mt-4'>
                <label className='text-gray-600 font-medium'>
                  Dirección <span className='text-red-600'>*</span>
                </label>
                <Controller
                  name='location'
                  rules={{ required: true }}
                  control={control}
                  placeh
                  render={({ field, fieldState }) => (
                    <GooglePlacesAutocomplete
                      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                      error={fieldState.error}
                      selectProps={{
                        ...field,
                        isClearable: true,
                        placeholder: 'Ingresa una dirección',
                      }}
                      apiOptions={{ language: 'es', region: 'mx' }}
                    />
                  )}
                />
              </div>
              {errors.location && (
                <div className='mb-3 text-normal text-red-500'>Favor de ingresar una dirección</div>
              )}

              <div className='mt-4'>
                <label className='text-gray-600 font-medium'>
                  Clave de Elector <span className='text-red-600'>*</span>
                </label>
                <input
                  className='border-solid border-gray-300 border p-2  w-full rounded text-gray-700'
                  name='electorIdentifier'
                  {...register('electorIdentifier', {
                    required: true,
                    validate: isValidElectorIdentifier,
                  })}
                />
                {errors?.electorIdentifier?.type === 'required' && (
                  <div className='mb-3 text-normal text-red-500'>
                    Favor de ingresar una clave de elector
                  </div>
                )}
                {errors?.electorIdentifier?.type === 'validate' && (
                  <div className='mb-3 text-normal text-red-500'>
                    Favor de ingresar una clave de elector valida
                  </div>
                )}
              </div>

              <div className='mt-4'>
                <label className='text-gray-600 font-medium'>
                  Número de Personas Votando en ese hogar <span className='text-red-600'>*</span>
                </label>
                <input
                  className='border-solid border-gray-300 border p-2  w-full rounded text-gray-700'
                  name='peopleVoting'
                  {...register('peopleVoting', {
                    required: true,
                    min: 1,
                  })}
                  type='number'
                />
                {errors?.peopleVoting?.type === 'required' && (
                  <div className='mb-3 text-normal text-red-500'>
                    Favor de ingresar el número de votantes
                  </div>
                )}
                {errors?.peopleVoting?.type === 'min' && (
                  <div className='mb-3 text-normal text-red-500'>
                    Favor de ingresar un número valido
                  </div>
                )}
              </div>

              <button
                className={
                  isLoading
                    ? 'mt-8 w-full bg-slate-400 hover:bg-slate-600 text-white-100 border py-3 px-6 font-semibold text-md rounded'
                    : 'mt-8 w-full bg-green-400 hover:bg-green-600 text-green-100 border py-3 px-6 font-semibold text-md rounded'
                }
                type='submit'
                disabled={isLoading}
              >
                Enviar
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default RegistrarPromovido;
