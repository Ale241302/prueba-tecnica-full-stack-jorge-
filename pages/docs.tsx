// Documentación API con Swagger/OpenAPI
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import Head from 'next/head';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const ApiDoc = ({ spec }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <>
    <Head>
      <title>Documentación API - PrevalentWare</title>
      <meta
        name='description'
        content='Documentación de la API REST del sistema de gestión financiera'
      />
    </Head>
    <SwaggerUI spec={spec} />
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'pages/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Gestión Financiera - PrevalentWare',
        version: '1.0.0',
        description:
          'API REST para el sistema de gestión de ingresos y egresos. Incluye autenticación, gestión de usuarios y reportes.',
      },
      components: {
        securitySchemes: {
          sessionAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'better-auth.session_token',
            description: 'Token de sesión generado por Better Auth',
          },
        },
        schemas: {
          Transaction: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              concept: { type: 'string' },
              amount: { type: 'number' },
              date: { type: 'string', format: 'date-time' },
              type: { type: 'string', enum: ['INGRESO', 'EGRESO'] },
              userId: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string', nullable: true },
              role: { type: 'string', enum: ['ADMIN', 'USER'] },
              image: { type: 'string', nullable: true },
            },
          },
        },
      },
      security: [],
    },
  });

  return { props: { spec } };
};

export default ApiDoc;
