import { Heading, View, useTheme, useAuthenticator, Button, Text } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';

export const components = {
  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Ingresa a tu cuenta
        </Heading>
      );
    },
    Footer() {
      const { toResetPassword } = useAuthenticator();

      return (
        <View textAlign='center'>
          <Button fontWeight='normal' onClick={toResetPassword} size='small' variation='link'>
            Recuperar contraseña
          </Button>
        </View>
      );
    },
  },

  SignUp: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Creación de cuenta para coordinadores
        </Heading>
      );
    },

    FormFields() {
      return (
        <>
          {/* Re-use default `Authenticator.SignUp.FormFields` */}
          <Authenticator.SignUp.FormFields />
        </>
      );
    },

    Footer() {
      const { toSignIn } = useAuthenticator();

      return (
        <View textAlign='center'>
          <Button fontWeight='normal' onClick={toSignIn} size='small' variation='link'>
            Iniciar sesión
          </Button>
        </View>
      );
    },
  },
  ConfirmSignUp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Ingresa tu código de confirmación
        </Heading>
      );
    },
  },
  SetupTOTP: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ConfirmSignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Enter Information:
        </Heading>
      );
    },
  },
  ResetPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Recuperar contraseña
        </Heading>
      );
    },
  },
  ConfirmResetPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Recupera tu Contraseña
        </Heading>
      );
    },
  },
};

export const formFields = {
  signIn: {
    username: {
      placeholder: 'Teléfono',
      dialCodeList: ['+52'],
    },
    password: {
      placeholder: 'Ingresa tu contraseña',
    },
  },
  signUp: {
    name: {
      label: 'Nombre',
      placeholder: 'Ingresa tu nombre',
      isRequired: true,
      order: 1,
    },
    phone_number: {
      label: 'Número de teléfono',
      placeholder: 'Teléfono',
      isRequired: true,
      order: 2,
      dialCodeList: ['+52'],
    },
    email: {
      label: 'Email',
      placeholder: 'Email',
      isRequired: true,
      order: 3,
    },

    password: {
      label: 'Contraseña:',
      placeholder: 'Ingresa tu contraseña',
      isRequired: true,
      order: 4,
    },
    confirm_password: {
      label: 'Confirma tu contraseña:',
      placeholder: 'Confirma tu contraseña',

      isRequired: true,
      order: 5,
    },
    ['custom:ancestorId']: {
      label: 'Identificador Coordinador',
      placeholder: 'Ingresa el identificador',
      isRequired: true,
      order: 5,
    },
  },
  forceNewPassword: {
    password: {
      placeholder: 'Enter your Password:',
    },
  },
  resetPassword: {
    username: {
      placeholder: 'Teléfono',
      dialCodeList: ['+52'],
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: 'Enter your Confirmation Code:',
      label: 'Código de confirmación',
      isRequired: true,
    },
    confirm_password: {
      placeholder: 'Enter your Password Please:',
    },
  },
  setupTOTP: {
    QR: {
      totpIssuer: 'test issuer',
      totpUsername: 'amplify_qr_test_user',
    },
    confirmation_code: {
      label: 'New Label',
      placeholder: 'Enter your Confirmation Code:',
      isRequired: false,
    },
  },
  confirmSignIn: {
    confirmation_code: {
      label: 'New Label',
      placeholder: 'Enter your Confirmation Code:',
      isRequired: false,
    },
  },
};
