import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
<<<<<<< HEAD
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView
=======
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Image,
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useI18n } from '../services/I18nService';

<<<<<<< HEAD
const LoginScreen = ({ navigation }) => {
=======
const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { t, currentLanguage } = useI18n();
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // 模拟登录过程
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('MainTabs');
    }, 1500);
  };

<<<<<<< HEAD
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // 这里可以集成社交登录
=======
    setIsLoading(true);
    
    try {
      // 这里应该调用实际的登录API
      // 模拟登录过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 保存用户token
      await AsyncStorage.setItem('userToken', 'demo_token_123');
      
      // 导航到主应用
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('登录失败', '请检查您的凭据');
    } finally {
      setIsLoading(false);
    }
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  };

  const handleSocialLogin = (provider) => {
    Alert.alert('社交登录', `${provider} 登录功能即将推出`);
  };

  return (
<<<<<<< HEAD
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Ionicons name="globe" size={40} color="#fff" />
                </View>
                <Text style={styles.logoText}>CultureBridge</Text>
                <Text style={styles.tagline}>连接世界，交流文化</Text>
              </View>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <View style={styles.formCard}>
                <Text style={styles.welcomeText}>欢迎回来</Text>
                <Text style={styles.subtitleText}>登录您的账户继续文化探索之旅</Text>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#667eea" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="邮箱地址"
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#667eea" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="密码"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>忘记密码？</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.loginGradient}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.loginButtonText}>登录中...</Text>
                      </View>
                    ) : (
                      <Text style={styles.loginButtonText}>登录</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>或使用以下方式登录</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Login */}
                <View style={styles.socialContainer}>
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin('google')}
                  >
                    <Ionicons name="logo-google" size={24} color="#db4437" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin('facebook')}
                  >
                    <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin('apple')}
                  >
                    <Ionicons name="logo-apple" size={24} color="#000" />
                  </TouchableOpacity>
                </View>

                {/* Register Link */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>还没有账户？</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>立即注册</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
=======
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#6B46C1', '#9333EA', '#EC4899']}
        style={styles.gradient}
      >
        {/* Logo和标题区域 */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="globe" size={40} color="white" />
          </View>
          <Text style={styles.logoText}>CultureBridge</Text>
          <Text style={styles.taglineText}>{t('auth.joinCommunity')}</Text>
        </View>

        {/* 登录表单 */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Text style={styles.welcomeTitle}>{t('auth.welcome')}</Text>
            <Text style={styles.welcomeSubtitle}>登录您的账户继续探索</Text>

            {/* 邮箱输入 */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={t('auth.email')}
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* 密码输入 */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={t('auth.password')}
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            {/* 忘记密码 */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>

            {/* 登录按钮 */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#6B46C1', '#9333EA']}
                style={styles.loginGradient}
              >
                {isLoading ? (
                  <Text style={styles.loginButtonText}>登录中...</Text>
                ) : (
                  <Text style={styles.loginButtonText}>{t('auth.loginButton')}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* 分割线 */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('auth.orLoginWith')}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* 社交登录按钮 */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
              >
                <Ionicons name="logo-google" size={24} color="#EA4335" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
              >
                <Ionicons name="logo-apple" size={24} color="#000" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('WeChat')}
              >
                <Ionicons name="chatbubbles" size={24} color="#07C160" />
              </TouchableOpacity>
            </View>

            {/* 注册链接 */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{t('auth.noAccount')} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>{t('auth.register')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
<<<<<<< HEAD
=======
    justifyContent: 'center',
    alignItems: 'center',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: 16,
=======
    marginBottom: 20,
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
<<<<<<< HEAD
    color: '#fff',
=======
    color: 'white',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
    marginBottom: 8,
  },
  taglineText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  formContainer: {
<<<<<<< HEAD
    flex: 1,
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 32,
=======
    width: width - 40,
    maxWidth: 400,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
<<<<<<< HEAD
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
=======
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingVertical: 16,
    paddingHorizontal: 12,
=======
    backgroundColor: '#f9fafb',
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
  eyeButton: {
    padding: 8,
  },
<<<<<<< HEAD
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
=======
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 25,
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginGradient: {
    paddingVertical: 18,
    alignItems: 'center',
<<<<<<< HEAD
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
=======
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: 24,
=======
    marginBottom: 25,
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
  dividerLine: {
    flex: 1,
    height: 1,
<<<<<<< HEAD
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    fontSize: 14,
    color: '#7f8c8d',
    paddingHorizontal: 16,
=======
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 15,
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
<<<<<<< HEAD
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
=======
    marginBottom: 25,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
<<<<<<< HEAD
    color: '#7f8c8d',
    marginRight: 4,
  },
  registerLink: {
    fontSize: 16,
    color: '#667eea',
=======
    color: '#6b7280',
  },
  registerLink: {
    fontSize: 16,
    color: '#6B46C1',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
    fontWeight: '600',
  },
});

export default LoginScreen;

