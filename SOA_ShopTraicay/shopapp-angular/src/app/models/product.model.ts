export class Product {
    id: number;
    name: string;
    price: string | number; // Backend trả về unit_price (number)
    category: string;
    trademark?: string; // Không có trong backend
    status: string; // Backend dùng is_active (boolean)
    image: string; // Backend trả về image_url
    images?: string[];
    description?: string;
    quantity?: string | number; // Backend trả về quantity (number)
    unit?: string; // Backend có unit
    unit_price?: number; // Backend field
    image_url?: string; // Backend field
    is_active?: boolean; // Backend field

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.name = data.name || '';
        // Backend trả về unit_price, frontend dùng price
        this.price = data.unit_price !== undefined ? data.unit_price : (data.price || '0');
        this.category = data.category || '';
        this.trademark = data.trademark || '';
        // Backend dùng is_active (boolean), frontend dùng status (string)
        this.status = data.is_active === false ? 'inactive' : (data.status || 'active');
        // Backend trả về image_url, frontend dùng image
        this.image = data.image_url || data.image || '';
        this.image_url = data.image_url || data.image || '';
        this.images = data.images ? (Array.isArray(data.images) ? data.images : [data.images]) : [];
        this.description = data.description || '';
        // Backend trả về quantity (number)
        this.quantity = data.quantity !== undefined ? data.quantity : (data.quantity || '0');
        this.unit = data.unit || 'kg';
        this.unit_price = data.unit_price || parseFloat(String(this.price)) || 0;
        this.is_active = data.is_active !== undefined ? data.is_active : (this.status !== 'inactive');
    }

    // Helper method to get formatted price
    getFormattedPrice(): string {
        const priceNum = typeof this.price === 'number' ? this.price : parseFloat(String(this.price)) || 0;
        return `${priceNum.toLocaleString('vi-VN')} VNĐ`;
    }

    // Helper method to get full image URL
    getFullImageUrl(): string {
        if (!this.image) return this.getDefaultImage();
        return this.image.startsWith('http') ? this.image : `http://localhost:3001${this.image}`;
    }

    // Helper method to get default image if main image fails
    getDefaultImage(): string {
        // Sử dụng data URI hoặc local asset thay vì external URL
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    }

    // Check if product is in stock
    isInStock(): boolean {
        const qty = typeof this.quantity === 'number' ? this.quantity : parseInt(String(this.quantity)) || 0;
        return qty > 0 && this.is_active !== false;
    }
} 