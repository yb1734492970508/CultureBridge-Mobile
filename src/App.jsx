import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { 
  Globe, 
  MessageCircle, 
  BookOpen, 
  Languages, 
  Coins, 
  Users, 
  Star, 
  ArrowRight, 
  Play, 
  CheckCircle,
  Home,
  Search,
  Heart,
  User,
  Menu,
  Bell,
  Settings,
  Camera,
  Mic,
  Send,
  Phone,
  Video
} from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('home'); // home, chat, learning, profile

  // 模拟用户数据
  const user = {
    name: '张小明',
    level: 5,
    points: 1250,
    avatar: '👤',
    languages: ['中文', 'English', '日本語']
  };

  // 模拟聊天数据
  const chatRooms = [
    {
      id: 1,
      name: '中英文化交流',
      lastMessage: '大家好！有人想练习英语吗？',
      time: '2分钟前',
      unread: 3,
      avatar: '🌍'
    },
    {
      id: 2,
      name: '日语学习角',
      lastMessage: 'こんにちは！今日はどうですか？',
      time: '5分钟前',
      unread: 1,
      avatar: '🇯🇵'
    },
    {
      id: 3,
      name: '文化分享',
      lastMessage: '刚刚分享了一个关于春节的视频',
      time: '10分钟前',
      unread: 0,
      avatar: '🎎'
    }
  ];

  // 模拟学习内容
  const learningContent = [
    {
      id: 1,
      title: '基础英语对话',
      progress: 75,
      lessons: 12,
      completed: 9,
      category: '语言学习',
      difficulty: '初级'
    },
    {
      id: 2,
      title: '中国传统文化',
      progress: 45,
      lessons: 8,
      completed: 4,
      category: '文化探索',
      difficulty: '中级'
    },
    {
      id: 3,
      title: '商务日语',
      progress: 20,
      lessons: 15,
      completed: 3,
      category: '语言学习',
      difficulty: '高级'
    }
  ];

  // 渲染首页
  const renderHome = () => (
    <div className="space-y-6">
      {/* 用户信息卡片 */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{user.avatar}</div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-blue-100">等级 {user.level} • {user.points} 积分</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{user.points}</div>
              <div className="text-sm text-blue-100">积分</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 快速操作 */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-20 flex-col space-y-2"
          onClick={() => setCurrentView('chat')}
        >
          <MessageCircle className="w-6 h-6" />
          <span>开始聊天</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col space-y-2"
          onClick={() => setCurrentView('learning')}
        >
          <BookOpen className="w-6 h-6" />
          <span>继续学习</span>
        </Button>
      </div>

      {/* 今日推荐 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">今日推荐</h3>
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🎎</div>
                <div className="flex-1">
                  <h4 className="font-medium">日本茶道文化</h4>
                  <p className="text-sm text-gray-500">了解日本传统茶道的精神内涵</p>
                </div>
                <Badge>+50积分</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🗣️</div>
                <div className="flex-1">
                  <h4 className="font-medium">英语口语练习</h4>
                  <p className="text-sm text-gray-500">与母语者进行实时对话练习</p>
                </div>
                <Badge variant="outline">热门</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // 渲染聊天页面
  const renderChat = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">聊天室</h2>
        <Button size="sm">
          <Search className="w-4 h-4 mr-2" />
          搜索
        </Button>
      </div>
      
      <div className="space-y-3">
        {chatRooms.map((room) => (
          <Card key={room.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{room.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{room.name}</h4>
                    <span className="text-xs text-gray-500">{room.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                </div>
                {room.unread > 0 && (
                  <Badge className="bg-red-500 text-white">{room.unread}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 翻译工具 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">实时翻译</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="输入要翻译的文字..." />
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Mic className="w-4 h-4 mr-2" />
              语音输入
            </Button>
            <Button size="sm" variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              拍照翻译
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 渲染学习页面
  const renderLearning = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">我的学习</h2>
        <Button size="sm" variant="outline">
          <Search className="w-4 h-4 mr-2" />
          发现课程
        </Button>
      </div>

      {/* 学习统计 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">15</div>
            <div className="text-sm text-gray-500">连续学习天数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">28</div>
            <div className="text-sm text-gray-500">完成课程</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">1250</div>
            <div className="text-sm text-gray-500">获得积分</div>
          </CardContent>
        </Card>
      </div>

      {/* 学习内容 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">正在学习</h3>
        <div className="space-y-4">
          {learningContent.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{course.title}</h4>
                    <Badge variant="outline">{course.difficulty}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>进度: {course.completed}/{course.lessons} 课</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    继续学习
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // 渲染个人资料页面
  const renderProfile = () => (
    <div className="space-y-6">
      {/* 用户头像和基本信息 */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">{user.avatar}</div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500">等级 {user.level} • {user.points} 积分</p>
            </div>
            <div className="flex justify-center space-x-2">
              {user.languages.map((lang, index) => (
                <Badge key={index} variant="outline">{lang}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成就 */}
      <Card>
        <CardHeader>
          <CardTitle>我的成就</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-sm font-medium">文化探索者</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-sm font-medium">语言大师</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm font-medium">社交达人</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm font-medium">学习之星</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 设置选项 */}
      <Card>
        <CardHeader>
          <CardTitle>设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <span>账户设置</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <span>通知设置</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-3">
              <Languages className="w-5 h-5 text-gray-500" />
              <span>语言偏好</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 渲染当前视图
  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return renderChat();
      case 'learning':
        return renderLearning();
      case 'profile':
        return renderProfile();
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">CultureBridge</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost">
              <Bell className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="p-4 pb-20">
        {renderCurrentView()}
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 gap-1">
          <Button
            variant={currentView === 'home' ? 'default' : 'ghost'}
            className="h-16 flex-col space-y-1 rounded-none"
            onClick={() => setCurrentView('home')}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">首页</span>
          </Button>
          
          <Button
            variant={currentView === 'chat' ? 'default' : 'ghost'}
            className="h-16 flex-col space-y-1 rounded-none"
            onClick={() => setCurrentView('chat')}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">聊天</span>
          </Button>
          
          <Button
            variant={currentView === 'learning' ? 'default' : 'ghost'}
            className="h-16 flex-col space-y-1 rounded-none"
            onClick={() => setCurrentView('learning')}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">学习</span>
          </Button>
          
          <Button
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            className="h-16 flex-col space-y-1 rounded-none"
            onClick={() => setCurrentView('profile')}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">我的</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;

