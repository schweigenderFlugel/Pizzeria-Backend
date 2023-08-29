import {
  Controller,
  Inject,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { OrderService } from '../application/service/order.service';
import { ORDER_REPOSITORY } from '../application/repository/order.repository.interface';
import { OrderRepository } from '../infrastructure/persistence/order.repository';
import { Order } from '../domain/order.entity';
import { CreateOrderDto } from '../application/dto/create-order.dto';
import { OrderMapper } from '../application/order.mapper';

@Controller('order')
export class OrderController {
  constructor(
    @Inject(OrderService) private readonly orderService: OrderService,
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(OrderMapper) private readonly orderMapper: OrderMapper,
  ) {}

  @Get()
  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find();
    return orders;
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId);
    return order;
  }

  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    const order = this.orderMapper.fromDtoToEntity(dto);
    const newOrder = await this.orderService.create(order);
    return newOrder;
  }
}
