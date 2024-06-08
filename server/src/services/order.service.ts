class OrderService {
  async getAll(req: Request) {}

  async createOrder(req: Request) {}

  async deleteOrder(req: Request) {}

  async updateOrder(req: Request) {}

  async getOrderByBuyerId(req: Request) {}

  async getOrderByEventId(req: Request) {}

  async getOrderBySellerId(req: Request) {}
}

export default new OrderService();
