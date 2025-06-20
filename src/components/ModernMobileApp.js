import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  StatusBar,
  Platform,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';

const { width, height } = Dimensions.get('window');

// 多语言支持
const translations = {
  'zh': {
    appName: 'CultureBridge',
    tagline: '文化桥梁',
    heroTitle: '重新定义\n文化学习体验',
    heroSubtitle: '通过AI技术与真人导师的完美结合，为您打造个性化的文化探索之旅。',
    startJourney: '开启旅程',
    watchDemo: '观看演示',
    features: '核心功能',
    immersiveExperience: '沉浸式文化体验',
    smartLanguage: '智能语言交流',
    globalCommunity: '全球精英社区',
    immersiveDesc: '通过AI驱动的个性化学习路径，深入探索150+国家的真实文化。',
    smartDesc: '实时语音翻译、智能语法纠正、文化语境解释。',
    communityDesc: '连接来自世界顶尖大学、跨国企业的文化爱好者。',
    stats: {
      users: '活跃用户',
      countries: '国家覆盖',
      languages: '支持语言',
      satisfaction: '满意度'
    }
  },
  'en': {
    appName: 'CultureBridge',
    tagline: 'Cultural Bridge',
    heroTitle: 'Redefining\nCultural Learning',
    heroSubtitle: 'Through the perfect combination of AI technology and human mentors, we create personalized cultural exploration journeys.',
    startJourney: 'Start Journey',
    watchDemo: 'Watch Demo',
    features: 'Core Features',
    immersiveExperience: 'Immersive Cultural Experience',
    smartLanguage: 'Smart Language Exchange',
    globalCommunity: 'Global Elite Community',
    immersiveDesc: 'Explore authentic cultures from 150+ countries through AI-driven personalized learning paths.',
    smartDesc: 'Real-time voice translation, intelligent grammar correction, and cultural context explanation.',
    communityDesc: 'Connect with culture enthusiasts from world-class universities and multinational companies.',
    stats: {
      users: 'Active Users',
      countries: 'Countries',
      languages: 'Languages',
      satisfaction: 'Satisfaction'
    }
  },
  'ja': {
    appName: 'CultureBridge',
    tagline: '文化の架け橋',
    heroTitle: '文化学習体験を\n再定義する',
    heroSubtitle: 'AI技術と人間の指導者の完璧な組み合わせにより、パーソナライズされた文化探索の旅を創造します。',
    startJourney: '旅を始める',
    watchDemo: 'デモを見る',
    features: 'コア機能',
    immersiveExperience: '没入型文化体験',
    smartLanguage: 'スマート言語交換',
    globalCommunity: 'グローバルエリートコミュニティ',
    immersiveDesc: 'AI駆動のパーソナライズされた学習パスを通じて、150以上の国の本格的な文化を探索。',
    smartDesc: 'リアルタイム音声翻訳、インテリジェント文法修正、文化的文脈説明。',
    communityDesc: '世界一流の大学や多国籍企業の文化愛好家とつながる。',
    stats: {
      users: 'アクティブユーザー',
      countries: '国',
      languages: '言語',
      satisfaction: '満足度'
    }
  },
  'es': {
    appName: 'CultureBridge',
    tagline: 'Puente Cultural',
    heroTitle: 'Redefiniendo\nla Experiencia Cultural',
    heroSubtitle: 'A través de la combinación perfecta de tecnología AI y mentores humanos, creamos viajes de exploración cultural personalizados.',
    startJourney: 'Comenzar Viaje',
    watchDemo: 'Ver Demo',
    features: 'Características Principales',
    immersiveExperience: 'Experiencia Cultural Inmersiva',
    smartLanguage: 'Intercambio Inteligente de Idiomas',
    globalCommunity: 'Comunidad Elite Global',
    immersiveDesc: 'Explora culturas auténticas de más de 150 países a través de rutas de aprendizaje personalizadas impulsadas por AI.',
    smartDesc: 'Traducción de voz en tiempo real, corrección inteligente de gramática y explicación del contexto cultural.',
    communityDesc: 'Conecta con entusiastas de la cultura de universidades de clase mundial y empresas multinacionales.',
    stats: {
      users: 'Usuarios Activos',
      countries: 'Países',
      languages: 'Idiomas',
      satisfaction: 'Satisfacción'
    }
  }
};

// 获取设备语言
const getDeviceLanguage = () => {
  const locale = Localization.locale;
  if (locale.startsWith('zh')) return 'zh';
  if (locale.startsWith('ja')) return 'ja';
  if (locale.startsWith('es')) return 'es';
  return 'en'; // 默认英语
};

const ModernMobileApp = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getDeviceLanguage());
  const [isVisible, setIsVisible] = useState(false);

  const t = translations[currentLanguage];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: 'globe-outline',
      title: t.immersiveExperience,
      description: t.immersiveDesc,
      color: ['#10b981', '#06b6d4'],
      bgColor: '#f0fdf4'
    },
    {
      icon: 'chatbubbles-outline',
      title: t.smartLanguage,
      description: t.smartDesc,
      color: ['#8b5cf6', '#3b82f6'],
      bgColor: '#faf5ff'
    },
    {
      icon: 'people-outline',
      title: t.globalCommunity,
      description: t.communityDesc,
      color: ['#f59e0b', '#ef4444'],
      bgColor: '#fffbeb'
    }
  ];

  const stats = [
    { number: '2M+', label: t.stats.users, icon: 'people' },
    { number: '150+', label: t.stats.countries, icon: 'globe' },
    { number: '50+', label: t.stats.languages, icon: 'language' },
    { number: '98%', label: t.stats.satisfaction, icon: 'heart' }
  ];

  const LanguageSelector = () => (
    <View style={styles.languageSelector}>
      {Object.keys(translations).map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[
            styles.languageButton,
            currentLanguage === lang && styles.languageButtonActive
          ]}
          onPress={() => setCurrentLanguage(lang)}
        >
          <Text style={[
            styles.languageText,
            currentLanguage === lang && styles.languageTextActive
          ]}>
            {lang.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#10b981', '#06b6d4']}
                style={styles.logoGradient}
              >
                <Ionicons name="globe" size={28} color="white" />
              </LinearGradient>
              <View style={styles.logoText}>
                <Text style={styles.appName}>{t.appName}</Text>
                <Text style={styles.tagline}>{t.tagline}</Text>
              </View>
            </View>
            <LanguageSelector />
          </View>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={['#f0fdf4', '#ecfdf5', '#e6fffa']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.badge}>
              <Ionicons name="sparkles" size={16} color="#10b981" />
              <Text style={styles.badgeText}>
                {currentLanguage === 'zh' ? '全球首个AI驱动的文化交流平台' : 
                 currentLanguage === 'ja' ? '世界初のAI駆動文化交流プラットフォーム' :
                 currentLanguage === 'es' ? 'Primera plataforma de intercambio cultural impulsada por AI' :
                 'World\'s First AI-Powered Cultural Exchange Platform'}
              </Text>
            </View>
            
            <Text style={styles.heroTitle}>{t.heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{t.heroSubtitle}</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton}>
                <LinearGradient
                  colors={['#10b981', '#06b6d4', '#3b82f6']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="play" size={20} color="white" />
                  <Text style={styles.primaryButtonText}>{t.startJourney}</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="videocam-outline" size={20} color="#374151" />
                <Text style={styles.secondaryButtonText}>{t.watchDemo}</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name={stat.icon} size={20} color="#10b981" />
                  </View>
                  <Text style={styles.statNumber}>{stat.number}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}>
              <Ionicons name="trophy" size={16} color="#10b981" />
              <Text style={styles.sectionBadgeText}>
                {currentLanguage === 'zh' ? '为什么选择我们' : 
                 currentLanguage === 'ja' ? 'なぜ私たちを選ぶのか' :
                 currentLanguage === 'es' ? 'Por qué elegirnos' :
                 'Why Choose Us'}
              </Text>
            </View>
            <Text style={styles.sectionTitle}>
              {currentLanguage === 'zh' ? '超越传统的' : 
               currentLanguage === 'ja' ? '従来を超えた' :
               currentLanguage === 'es' ? 'Más allá de lo tradicional' :
               'Beyond Traditional'}
              <Text style={styles.sectionTitleAccent}>
                {currentLanguage === 'zh' ? '学习体验' : 
                 currentLanguage === 'ja' ? '学習体験' :
                 currentLanguage === 'es' ? ' Experiencia de Aprendizaje' :
                 ' Learning Experience'}
              </Text>
            </Text>
            <Text style={styles.sectionSubtitle}>
              {currentLanguage === 'zh' ? '我们将最先进的AI技术与人文关怀相结合，为您创造前所未有的文化学习体验' :
               currentLanguage === 'ja' ? '最先端のAI技術と人間的配慮を組み合わせ、前例のない文化学習体験を創造します' :
               currentLanguage === 'es' ? 'Combinamos la tecnología AI más avanzada con el cuidado humano para crear experiencias de aprendizaje cultural sin precedentes' :
               'We combine cutting-edge AI technology with human care to create unprecedented cultural learning experiences'}
            </Text>
          </View>

          {features.map((feature, index) => (
            <View key={index} style={[styles.featureCard, { backgroundColor: feature.bgColor }]}>
              <View style={styles.featureHeader}>
                <LinearGradient
                  colors={feature.color}
                  style={styles.featureIcon}
                >
                  <Ionicons name={feature.icon} size={24} color="white" />
                </LinearGradient>
                <View style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>
                    {index === 0 ? (currentLanguage === 'zh' ? 'AI 驱动' : 'AI Powered') :
                     index === 1 ? (currentLanguage === 'zh' ? '实时翻译' : 'Real-time') :
                     (currentLanguage === 'zh' ? '精英社区' : 'Elite')}
                  </Text>
                </View>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
              <View style={styles.featureFooter}>
                <Text style={styles.featureStats}>
                  {index === 0 ? '150+ ' + (currentLanguage === 'zh' ? '国家' : currentLanguage === 'ja' ? '国' : currentLanguage === 'es' ? 'Países' : 'Countries') :
                   index === 1 ? '50+ ' + (currentLanguage === 'zh' ? '语言' : currentLanguage === 'ja' ? '言語' : currentLanguage === 'es' ? 'Idiomas' : 'Languages') :
                   '1M+ ' + (currentLanguage === 'zh' ? '用户' : currentLanguage === 'ja' ? 'ユーザー' : currentLanguage === 'es' ? 'Usuarios' : 'Users')}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#10b981" />
              </View>
            </View>
          ))}
        </View>

        {/* CTA Section */}
        <LinearGradient
          colors={['#10b981', '#06b6d4', '#3b82f6']}
          style={styles.ctaSection}
        >
          <Text style={styles.ctaTitle}>
            {currentLanguage === 'zh' ? '准备好开始您的文化之旅了吗？' :
             currentLanguage === 'ja' ? '文化の旅を始める準備はできましたか？' :
             currentLanguage === 'es' ? '¿Listo para comenzar tu viaje cultural?' :
             'Ready to Start Your Cultural Journey?'}
          </Text>
          <Text style={styles.ctaSubtitle}>
            {currentLanguage === 'zh' ? '加入全球200万用户，探索世界文化，学习新语言，结交国际朋友。' :
             currentLanguage === 'ja' ? '世界中の200万人のユーザーに参加し、世界の文化を探索し、新しい言語を学び、国際的な友達を作りましょう。' :
             currentLanguage === 'es' ? 'Únete a 2 millones de usuarios globales para explorar culturas mundiales, aprender nuevos idiomas y hacer amigos internacionales.' :
             'Join 2 million global users to explore world cultures, learn new languages, and make international friends.'}
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>
              {currentLanguage === 'zh' ? '立即开始免费体验' :
               currentLanguage === 'ja' ? '今すぐ無料体験を開始' :
               currentLanguage === 'es' ? 'Comenzar prueba gratuita ahora' :
               'Start Free Trial Now'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#10b981" />
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGradient: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tagline: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  languageSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    padding: 2,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  languageButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  languageTextActive: {
    color: '#10b981',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroContent: {
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 42,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  primaryButton: {
    marginBottom: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 16,
  },
  sectionTitleAccent: {
    color: '#10b981',
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 24,
  },
  featureCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureStats: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 8,
  },
});

export default ModernMobileApp;

