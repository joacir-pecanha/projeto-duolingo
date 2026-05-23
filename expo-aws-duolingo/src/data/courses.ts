import { Course } from '../types/course';

export const COURSES: Course[] = [
  {
    id: 'expo',
    title: 'Expo Framework',
    shortTitle: 'Expo',
    description:
      'Aprenda a construir aplicativos móveis profissionais com React Native e Expo. Do zero ao deploy na App Store e Google Play.',
    icon: 'smartphone',
    color: '#58CC02',
    shadowColor: '#46A302',
    lightColor: '#D7F5C5',
    totalLessons: 12,
    modules: [
      {
        id: 'expo-m1',
        courseId: 'expo',
        title: 'Fundamentos',
        description: 'Conceitos básicos do Expo e React Native',
        icon: 'box',
        order: 1,
        color: '#58CC02',
        lessons: [
          {
            id: 'expo-m1-l1',
            moduleId: 'expo-m1',
            title: 'O que é Expo?',
            description: 'Entenda o que é Expo e como ele facilita o desenvolvimento mobile',
            icon: 'star',
            order: 1,
            xpReward: 20,
            exercises: [
              {
                id: 'expo-m1-l1-e1',
                type: 'multiple-choice',
                question: 'O que é o Expo?',
                options: [
                  'Um framework para desenvolvimento web',
                  'Uma plataforma que facilita o desenvolvimento de apps com React Native',
                  'Um banco de dados mobile',
                  'Uma linguagem de programação',
                ],
                correctIndex: 1,
                explanation:
                  'O Expo é uma plataforma open-source que facilita a criação de apps React Native, fornecendo ferramentas, APIs e um ambiente de desenvolvimento robusto.',
                xpReward: 5,
              },
              {
                id: 'expo-m1-l1-e2',
                type: 'true-false',
                question: 'Expo permite criar apps para iOS e Android com um único código TypeScript.',
                correctAnswer: true,
                explanation:
                  'Correto! Um dos principais benefícios do Expo/React Native é o código multiplataforma.',
                xpReward: 5,
              },
              {
                id: 'expo-m1-l1-e3',
                type: 'multiple-choice',
                question: 'Qual comando inicia um projeto Expo?',
                options: [
                  'expo new meu-app',
                  'npx create-expo-app meu-app',
                  'npm start expo',
                  'expo init --project meu-app',
                ],
                correctIndex: 1,
                explanation:
                  'O comando correto é `npx create-expo-app meu-app`, que cria um projeto já configurado.',
                xpReward: 5,
              },
              {
                id: 'expo-m1-l1-e4',
                type: 'complete-code',
                question: 'Complete o componente básico de uma tela Expo:',
                codePrefix: 'import { View, Text } from "react-native";\n\nexport default function App() {\n  return (\n    <View>',
                codeSuffix: '\n    </View>\n  );\n}',
                options: [
                  '<Text>Hello World</Text>',
                  'console.log("Hello")',
                  '<div>Hello</div>',
                  'return null',
                ],
                correctIndex: 0,
                explanation:
                  'Em React Native usamos <Text> para exibir texto, nunca elementos HTML como <div> ou <p>.',
                xpReward: 5,
              },
            ],
          },
          {
            id: 'expo-m1-l2',
            moduleId: 'expo-m1',
            title: 'Componentes Básicos',
            description: 'View, Text, Image e StyleSheet',
            icon: 'layout',
            order: 2,
            xpReward: 20,
            exercises: [
              {
                id: 'expo-m1-l2-e1',
                type: 'multiple-choice',
                question: 'Qual componente é equivalente a uma <div> no React Native?',
                options: ['<Box>', '<View>', '<Container>', '<Section>'],
                correctIndex: 1,
                explanation:
                  '<View> é o componente fundamental de layout no React Native, equivalente à <div> do HTML.',
                xpReward: 5,
              },
              {
                id: 'expo-m1-l2-e2',
                type: 'true-false',
                question: 'No React Native, estilos são escritos em CSS puro com arquivos .css.',
                correctAnswer: false,
                explanation:
                  'Falso! No React Native, estilos são escritos em JavaScript com o StyleSheet.create() ou inline como objetos JS.',
                xpReward: 5,
              },
              {
                id: 'expo-m1-l2-e3',
                type: 'order-steps',
                question: 'Ordene os passos para exibir uma imagem local no Expo:',
                steps: [
                  'Usar o componente <Image>',
                  'Importar o arquivo de imagem',
                  'Passar source={require("./foto.png")}',
                  'Definir width e height no style',
                ],
                correctOrder: [1, 0, 2, 3],
                explanation:
                  'Primeiro importamos, depois usamos o componente <Image>, passamos o source e definimos as dimensões.',
                xpReward: 5,
              },
              {
                id: 'expo-m1-l2-e4',
                type: 'association',
                question: 'Associe o componente à sua função:',
                pairs: [
                  { left: '<View>', right: 'Container de layout' },
                  { left: '<Text>', right: 'Exibir texto' },
                  { left: '<Image>', right: 'Exibir imagens' },
                  { left: '<ScrollView>', right: 'Área com scroll' },
                ],
                explanation:
                  'Esses são os quatro componentes fundamentais do React Native para construir interfaces.',
                xpReward: 5,
              },
            ],
          },
          {
            id: 'expo-m1-l3',
            moduleId: 'expo-m1',
            title: 'Expo Router',
            description: 'Navegação baseada em arquivos',
            icon: 'navigation',
            order: 3,
            xpReward: 25,
            exercises: [
              {
                id: 'expo-m1-l3-e1',
                type: 'multiple-choice',
                question: 'Como o Expo Router define rotas no app?',
                options: [
                  'Através de um arquivo routes.json',
                  'Baseado na estrutura de arquivos na pasta /app',
                  'Via configuração no app.json',
                  'Através de um componente <Router>',
                ],
                correctIndex: 1,
                explanation:
                  'O Expo Router usa file-based routing: cada arquivo na pasta /app se torna automaticamente uma rota.',
                xpReward: 5,
              },
              {
                id: 'expo-m1-l3-e2',
                type: 'complete-code',
                question: 'Complete a navegação programática com Expo Router:',
                codePrefix: "import { useRouter } from 'expo-router';\n\nconst router = useRouter();\n\n// Navegar para a tela de perfil:\n",
                codeSuffix: ';',
                options: [
                  "router.push('/profile')",
                  "navigate('/profile')",
                  "router.go('/profile')",
                  "history.push('/profile')",
                ],
                correctIndex: 0,
                explanation:
                  'No Expo Router, usamos router.push() para navegar para uma nova rota.',
                xpReward: 5,
              },
              {
                id: 'expo-m1-l3-e3',
                type: 'true-false',
                question: 'O arquivo _layout.tsx no Expo Router define o layout compartilhado de um grupo de rotas.',
                correctAnswer: true,
                explanation:
                  'Correto! _layout.tsx é especial: envolve todas as telas do mesmo nível com um layout comum (headers, tabs, etc).',
                xpReward: 5,
              },
            ],
          },
        ],
      },
      {
        id: 'expo-m2',
        courseId: 'expo',
        title: 'Componentes Avançados',
        description: 'Animações, gestos e listas de alta performance',
        icon: 'zap',
        order: 2,
        color: '#1CB0F6',
        lessons: [
          {
            id: 'expo-m2-l1',
            moduleId: 'expo-m2',
            title: 'Animated API',
            description: 'Animações fluidas com React Native Animated',
            icon: 'activity',
            order: 1,
            xpReward: 30,
            exercises: [
              {
                id: 'expo-m2-l1-e1',
                type: 'multiple-choice',
                question: 'Qual é o estado inicial para uma animação de fade-in?',
                options: ['Animated.Value(100)', 'Animated.Value(1)', 'Animated.Value(0)', 'Animated.Value(true)'],
                correctIndex: 2,
                explanation:
                  'Para um fade-in, iniciamos com opacity 0 e animamos até 1.',
                xpReward: 10,
              },
              {
                id: 'expo-m2-l1-e2',
                type: 'true-false',
                question: 'Animated.timing() cria uma animação com duração e easing definidos.',
                correctAnswer: true,
                explanation:
                  'Correto! Animated.timing é o tipo de animação mais comum, com controle de duração e curva.',
                xpReward: 10,
              },
            ],
          },
          {
            id: 'expo-m2-l2',
            moduleId: 'expo-m2',
            title: 'FlatList',
            description: 'Listas de alta performance com virtualização',
            icon: 'list',
            order: 2,
            xpReward: 25,
            exercises: [
              {
                id: 'expo-m2-l2-e1',
                type: 'multiple-choice',
                question: 'Qual vantagem o FlatList tem sobre ScrollView + map()?',
                options: [
                  'Nenhuma diferença',
                  'Virtualização: renderiza só os itens visíveis',
                  'Permite usar CSS puro',
                  'Funciona apenas no iOS',
                ],
                correctIndex: 1,
                explanation:
                  'FlatList usa virtualização, renderizando apenas os itens visíveis na tela, o que é muito mais eficiente para listas grandes.',
                xpReward: 10,
              },
            ],
          },
        ],
      },
      {
        id: 'expo-m3',
        courseId: 'expo',
        title: 'APIs e Storage',
        description: 'Requisições, armazenamento e câmera',
        icon: 'database',
        order: 3,
        color: '#FF9600',
        lessons: [
          {
            id: 'expo-m3-l1',
            moduleId: 'expo-m3',
            title: 'Fetch e Axios',
            description: 'Consumindo APIs REST',
            icon: 'globe',
            order: 1,
            xpReward: 30,
            exercises: [
              {
                id: 'expo-m3-l1-e1',
                type: 'true-false',
                question: 'React Query automaticamente gerencia cache, loading e refetch de requisições.',
                correctAnswer: true,
                explanation:
                  'Sim! React Query (TanStack Query) é uma poderosa biblioteca que abstrai toda a lógica de estado de dados assíncronos.',
                xpReward: 10,
              },
            ],
          },
          {
            id: 'expo-m3-l2',
            moduleId: 'expo-m3',
            title: 'AsyncStorage e SecureStore',
            description: 'Persistência de dados local',
            icon: 'save',
            order: 2,
            xpReward: 25,
            exercises: [
              {
                id: 'expo-m3-l2-e1',
                type: 'multiple-choice',
                question: 'Qual biblioteca usar para armazenar tokens JWT de forma segura?',
                options: ['AsyncStorage', 'expo-secure-store', 'localStorage', 'expo-file-system'],
                correctIndex: 1,
                explanation:
                  'expo-secure-store usa o Keychain (iOS) e Keystore (Android) do sistema operacional para armazenar dados sensíveis com criptografia.',
                xpReward: 10,
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── CURSO 2: AWS ───
  {
    id: 'aws',
    title: 'AWS Cloud Computing',
    shortTitle: 'AWS',
    description:
      'Domine os serviços da Amazon Web Services. Aprenda IAM, S3, EC2, Lambda, API Gateway e DynamoDB com exercícios práticos.',
    icon: 'cloud',
    color: '#1CB0F6',
    shadowColor: '#1899D6',
    lightColor: '#DDF4FF',
    totalLessons: 14,
    modules: [
      {
        id: 'aws-m1',
        courseId: 'aws',
        title: 'Cloud Fundamentals',
        description: 'Conceitos essenciais de computação em nuvem',
        icon: 'cloud',
        order: 1,
        color: '#1CB0F6',
        lessons: [
          {
            id: 'aws-m1-l1',
            moduleId: 'aws-m1',
            title: 'O que é Cloud Computing?',
            description: 'Entenda os modelos de nuvem e suas vantagens',
            icon: 'star',
            order: 1,
            xpReward: 20,
            exercises: [
              {
                id: 'aws-m1-l1-e1',
                type: 'multiple-choice',
                question: 'O que significa IaaS?',
                options: [
                  'Internet as a Service',
                  'Infrastructure as a Service',
                  'Integration as a Service',
                  'Intelligence as a Service',
                ],
                correctIndex: 1,
                explanation:
                  'IaaS (Infrastructure as a Service) fornece infraestrutura de TI virtualizada — servidores, redes e armazenamento — pela internet.',
                xpReward: 5,
              },
              {
                id: 'aws-m1-l1-e2',
                type: 'association',
                question: 'Associe o modelo de serviço ao seu exemplo:',
                pairs: [
                  { left: 'IaaS', right: 'EC2 (servidores virtuais)' },
                  { left: 'PaaS', right: 'Elastic Beanstalk (plataforma)' },
                  { left: 'SaaS', right: 'Gmail (software pronto)' },
                  { left: 'FaaS', right: 'Lambda (funções serverless)' },
                ],
                explanation:
                  'Cada modelo representa um nível diferente de abstração e responsabilidade do provedor vs cliente.',
                xpReward: 5,
              },
              {
                id: 'aws-m1-l1-e3',
                type: 'true-false',
                question: 'Na AWS, você paga apenas pelos recursos que utiliza (pay-as-you-go).',
                correctAnswer: true,
                explanation:
                  'Correto! O modelo pay-as-you-go é uma das principais vantagens da nuvem — sem investimento inicial em hardware.',
                xpReward: 5,
              },
              {
                id: 'aws-m1-l1-e4',
                type: 'order-steps',
                question: 'Ordene as etapas para criar uma conta AWS:',
                steps: [
                  'Acessar aws.amazon.com',
                  'Verificar o email',
                  'Informar dados de pagamento',
                  'Clicar em "Criar uma conta AWS"',
                ],
                correctOrder: [0, 3, 2, 1],
                explanation:
                  'O fluxo correto é: acessar o site → clicar em criar conta → informar pagamento → verificar email.',
                xpReward: 5,
              },
            ],
          },
          {
            id: 'aws-m1-l2',
            moduleId: 'aws-m1',
            title: 'Regiões e Zonas',
            description: 'Infraestrutura global da AWS',
            icon: 'map',
            order: 2,
            xpReward: 20,
            exercises: [
              {
                id: 'aws-m1-l2-e1',
                type: 'multiple-choice',
                question: 'O que é uma Availability Zone (AZ) na AWS?',
                options: [
                  'Um país onde a AWS opera',
                  'Um datacenter isolado dentro de uma Região',
                  'Uma categoria de serviços AWS',
                  'Um tipo de instância EC2',
                ],
                correctIndex: 1,
                explanation:
                  'Uma AZ é um ou mais datacenters físicos com energia, rede e conectividade redundantes dentro de uma Região.',
                xpReward: 10,
              },
              {
                id: 'aws-m1-l2-e2',
                type: 'true-false',
                question: 'Distribuir sua aplicação em múltiplas AZs aumenta a resiliência.',
                correctAnswer: true,
                explanation:
                  'Correto! Multi-AZ é uma prática essencial para alta disponibilidade — se uma AZ falhar, as outras continuam.',
                xpReward: 10,
              },
            ],
          },
        ],
      },
      {
        id: 'aws-m2',
        courseId: 'aws',
        title: 'IAM e Segurança',
        description: 'Identity and Access Management',
        icon: 'shield',
        order: 2,
        color: '#EA2B2B',
        lessons: [
          {
            id: 'aws-m2-l1',
            moduleId: 'aws-m2',
            title: 'IAM Users e Roles',
            description: 'Controle de acesso na AWS',
            icon: 'user-check',
            order: 1,
            xpReward: 25,
            exercises: [
              {
                id: 'aws-m2-l1-e1',
                type: 'multiple-choice',
                question: 'Qual é a melhor prática para a conta root da AWS?',
                options: [
                  'Usar a conta root para todas as tarefas',
                  'Compartilhar a senha root com a equipe',
                  'Habilitar MFA e criar usuários IAM para uso diário',
                  'Desativar a conta root',
                ],
                correctIndex: 2,
                explanation:
                  'A conta root tem acesso total e irrestrito. A boa prática é ativar MFA e criar usuários IAM com permissões mínimas necessárias.',
                xpReward: 10,
              },
            ],
          },
          {
            id: 'aws-m2-l2',
            moduleId: 'aws-m2',
            title: 'Policies e Permissions',
            description: 'Políticas de acesso JSON',
            icon: 'lock',
            order: 2,
            xpReward: 25,
            exercises: [
              {
                id: 'aws-m2-l2-e1',
                type: 'true-false',
                question: 'O princípio do menor privilégio (least privilege) significa dar o mínimo de permissões necessárias.',
                correctAnswer: true,
                explanation:
                  'Correto! Esse princípio de segurança reduz a superfície de ataque — usuários e sistemas só acessam o que realmente precisam.',
                xpReward: 10,
              },
            ],
          },
        ],
      },
      {
        id: 'aws-m3',
        courseId: 'aws',
        title: 'S3 e Storage',
        description: 'Armazenamento de objetos na nuvem',
        icon: 'archive',
        order: 3,
        color: '#FF9600',
        lessons: [
          {
            id: 'aws-m3-l1',
            moduleId: 'aws-m3',
            title: 'S3 Buckets',
            description: 'Simple Storage Service',
            icon: 'folder',
            order: 1,
            xpReward: 20,
            exercises: [
              {
                id: 'aws-m3-l1-e1',
                type: 'multiple-choice',
                question: 'S3 armazena dados como:',
                options: ['Tabelas relacionais', 'Documentos JSON', 'Objetos (arquivos + metadados)', 'Grafos'],
                correctIndex: 2,
                explanation:
                  'S3 é um Object Storage — armazena qualquer arquivo (imagem, vídeo, JSON, backup) como objetos com uma chave única.',
                xpReward: 10,
              },
            ],
          },
          {
            id: 'aws-m3-l2',
            moduleId: 'aws-m3',
            title: 'S3 Policies e Versionamento',
            description: 'Controle de acesso e histórico de versões',
            icon: 'git-branch',
            order: 2,
            xpReward: 25,
            exercises: [
              {
                id: 'aws-m3-l2-e1',
                type: 'true-false',
                question: 'Por padrão, todos os buckets S3 são públicos e acessíveis pela internet.',
                correctAnswer: false,
                explanation:
                  'Falso! Por padrão, buckets S3 são privados. Você precisa configurar explicitamente políticas de acesso público.',
                xpReward: 10,
              },
            ],
          },
        ],
      },
      {
        id: 'aws-m4',
        courseId: 'aws',
        title: 'Lambda e Serverless',
        description: 'Computação sem servidor com AWS Lambda',
        icon: 'cpu',
        order: 4,
        color: '#FF9600',
        lessons: [
          {
            id: 'aws-m4-l1',
            moduleId: 'aws-m4',
            title: 'AWS Lambda',
            description: 'Funções serverless event-driven',
            icon: 'zap',
            order: 1,
            xpReward: 30,
            exercises: [
              {
                id: 'aws-m4-l1-e1',
                type: 'multiple-choice',
                question: 'Qual é a principal vantagem do AWS Lambda sobre um servidor EC2?',
                options: [
                  'Lambda é mais rápido em qualquer situação',
                  'Lambda não tem limite de tempo de execução',
                  'Lambda cobra apenas pelo tempo de execução, sem servidor idle',
                  'Lambda suporta qualquer linguagem de programação',
                ],
                correctIndex: 2,
                explanation:
                  'Lambda usa o modelo serverless — você paga apenas pelo tempo que a função executa, sem custos de servidor ocioso.',
                xpReward: 10,
              },
              {
                id: 'aws-m4-l1-e2',
                type: 'order-steps',
                question: 'Ordene o fluxo de uma requisição via API Gateway + Lambda:',
                steps: [
                  'Lambda processa e retorna resposta',
                  'Cliente faz requisição HTTP',
                  'API Gateway roteia para Lambda',
                  'API Gateway retorna resposta ao cliente',
                ],
                correctOrder: [1, 2, 0, 3],
                explanation:
                  'O fluxo é: cliente → API Gateway → Lambda (processa) → API Gateway → cliente.',
                xpReward: 10,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const getCourseById = (id: string): Course | undefined =>
  COURSES.find((c) => c.id === id);

export const getAllLessonIds = (courseId: string): string[] => {
  const course = getCourseById(courseId);
  if (!course) return [];
  return course.modules.flatMap((m) => m.lessons.map((l) => l.id));
};

export const getLessonById = (lessonId: string) => {
  for (const course of COURSES) {
    for (const mod of course.modules) {
      const lesson = mod.lessons.find((l) => l.id === lessonId);
      if (lesson) return { lesson, module: mod, course };
    }
  }
  return null;
};

export const getNextLessonId = (courseId: string, currentLessonId: string): string | null => {
  const allIds = getAllLessonIds(courseId);
  const idx = allIds.indexOf(currentLessonId);
  if (idx === -1 || idx === allIds.length - 1) return null;
  return allIds[idx + 1];
};
