import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Item } from 'src/module/item/domain/item.entity';
import { Order } from 'src/module/order/domain/order.entity';
import { Product } from 'src/module/product/domain/product.entity';
import { User } from 'src/module/user/domain/user.entity';
import { Category } from 'src/module/category/application/domain/category.entity';
import { Option } from 'src/module/option/domain/option.entity';
import { Auth } from 'src/module/auth/domain/auth.entity';
import { Address } from 'src/module/address/domain/address.entity';

import { itemFixtures } from './item';
import { orderFixtures } from './order';
import { userFixtures } from './user';
import { productFixtures } from './product';
import { categoryFixture } from './category';
import { optionFixtures } from './option';
import { authFixture } from './auth';
import { addressFixture } from './address';

export const loadFixtures = async (app: INestApplication) => {
  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: userFixtures, entity: User.name });

  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: categoryFixture, entity: Category.name });

  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: productFixtures, entity: Product.name });

  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: optionFixtures, entity: Option.name });

  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: orderFixtures, entity: Order.name });

  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: itemFixtures, entity: Item.name });

  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: authFixture, entity: Auth.name });

  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: addressFixture, entity: Address.name });
};
