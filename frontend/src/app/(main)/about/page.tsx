'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Target, Users, Award, Rocket, Heart, TrendingUp, Shield } from 'lucide-react';

export default function AboutPage() {
    const values = [
        {
            icon: Target,
            title: 'Sứ mệnh',
            description: 'Kết nối cộng đồng yêu thể thao, làm cho việc tìm sân và ghép kèo trở nên dễ dàng và thú vị hơn bao giờ hết.'
        },
        {
            icon: Users,
            title: 'Cộng đồng',
            description: 'Xây dựng nền tảng nơi mọi người có thể kết nối, chia sẻ đam mê và cùng nhau phát triển kỹ năng thể thao.'
        },
        {
            icon: Rocket,
            title: 'Đổi mới',
            description: 'Không ngừng cải tiến công nghệ để mang lại trải nghiệm đặt sân nhanh chóng, tiện lợi và hiện đại nhất.'
        },
        {
            icon: Shield,
            title: 'Uy tín',
            description: 'Cam kết minh bạch, chất lượng dịch vụ hàng đầu và bảo vệ quyền lợi của người dùng trong mọi giao dịch.'
        }
    ];

    const stats = [
        { value: '50K+', label: 'Thành viên' },
        { value: '1,200+', label: 'Sân đấu' },
        { value: '100K+', label: 'Lượt đặt sân' },
        { value: '10+', label: 'Thành phố' }
    ];

    const team = [
        { name: 'Nguyễn Văn A', role: 'CEO & Founder', avatar: '👨‍💼' },
        { name: 'Trần Thị B', role: 'CTO', avatar: '👩‍💻' },
        { name: 'Lê Văn C', role: 'Head of Product', avatar: '🧑‍🎨' },
        { name: 'Phạm Thị D', role: 'Community Manager', avatar: '👩‍💼' }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mesh-gradient">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
                            <Heart className="h-4 w-4 fill-primary animate-pulse" />
                            <span>Về chúng tôi</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
                            Đam mê <br />
                            <span className="text-primary italic">Thể thao</span> kết nối
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            SportHub ra đời với mục tiêu biến việc chơi thể thao thành trải nghiệm dễ dàng,
                            hiện đại và đầy cảm hứng cho mọi người tại Việt Nam.
                        </p>
                    </div>
                </div>

                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>
            </section>

            {/* Stats Section */}
            <section className="py-20 relative overflow-hidden bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="text-4xl md:text-6xl font-black italic">{stat.value}</div>
                                <div className="text-primary-foreground/70 uppercase text-xs font-bold tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                            Giá trị <span className="text-primary italic">Cốt lõi</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Những nguyên tắc định hướng mọi hoạt động của chúng tôi
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <div key={idx} className="group glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 tracking-tight">{value.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                            Đội ngũ <span className="text-primary italic">Lãnh đạo</span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Những con người đứng sau sứ mệnh của SportHub
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {team.map((member, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="w-32 h-32 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300 border-4 border-background shadow-xl">
                                    {member.avatar}
                                </div>
                                <h3 className="font-bold text-lg tracking-tight">{member.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                            <TrendingUp className="h-4 w-4" />
                            <span>Tham gia ngay hôm nay</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                            Sẵn sàng <span className="text-primary italic">bắt đầu</span>?
                        </h2>

                        <p className="text-xl text-muted-foreground">
                            Tham gia cộng đồng SportHub để trải nghiệm cách thức đặt sân và kết nối thể thao hiện đại nhất.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20 group overflow-hidden relative" asChild>
                                <Link href="/register">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Đăng ký miễn phí <Zap className="h-5 w-5 fill-current group-hover:scale-125 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl border-2 glass-card hover:bg-white/10" asChild>
                                <Link href="/venues">Khám phá sân đấu</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] select-none pointer-events-none font-black text-[15vw] uppercase leading-none flex items-center justify-center text-border">
                    <span>About</span>
                </div>
            </section>
        </div>
    );
}
