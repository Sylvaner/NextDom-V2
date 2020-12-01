import { Controller, UseInterceptors, Get } from '@nestjs/common';
import { LightService } from './light.service';
import { Crud, ParsedRequest, CrudRequest, CrudRequestInterceptor } from '@nestjsx/crud';
import { Light } from './light.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Light
  },
  routes: {
    only: ['getManyBase', 'getOneBase']
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true
    }
  },
  query: {
    filter: () => { }
  }
})

@ApiTags('light')

@Controller('light')
export class LightController {
  constructor(private readonly service: LightService) { }

  @UseInterceptors(CrudRequestInterceptor)
  @Get('/:id/state')
  @ApiResponse({ status: 200, type: Light, description: 'test' })
  async exportSome(@ParsedRequest() req: CrudRequest) {
    // some awesome feature handling
  }
}
