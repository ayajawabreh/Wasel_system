import { Test, TestingModule } from '@nestjs/testing';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

describe('RouteController', () => {
  let controller: RouteController;

  const mockRouteService = {
    estimateRoute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteController],
      providers: [
        {
          provide: RouteService,
          useValue: mockRouteService,
        },
      ],
    }).compile();

    controller = module.get<RouteController>(RouteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});