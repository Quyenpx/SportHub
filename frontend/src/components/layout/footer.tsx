import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-10">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-blue-600">SportHub.</h3>
                    <p className="text-sm text-muted-foreground">
                        Nền tảng kết nối thể thao hàng đầu. Đặt sân dễ dàng, tìm đối thủ xứng tầm.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Liên kết</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/venues" className="hover:text-primary">Tìm sân</Link></li>
                        <li><Link href="/matches" className="hover:text-primary">Tìm kèo</Link></li>
                        <li><Link href="/pricing" className="hover:text-primary">Bảng giá</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Hỗ trợ</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/faq" className="hover:text-primary">Câu hỏi thường gặp</Link></li>
                        <li><Link href="/contact" className="hover:text-primary">Liên hệ</Link></li>
                        <li><Link href="/terms" className="hover:text-primary">Điều khoản sử dụng</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Kết nối</h4>
                    <div className="flex gap-4 text-muted-foreground">
                        <Link href="#" className="hover:text-primary"><Facebook className="h-5 w-5" /></Link>
                        <Link href="#" className="hover:text-primary"><Instagram className="h-5 w-5" /></Link>
                        <Link href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></Link>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
                © 2026 SportHub by GDS. All rights reserved.
            </div>
        </footer>
    );
}
