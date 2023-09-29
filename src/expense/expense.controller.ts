import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { GetUserId } from 'src/auth/decorators';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import { PaginateDto, PaginateResultDto } from 'src/common/dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(20)
  @Get()
  getAllUserExpenses(
    @GetUserId() userId: number,
    @Query() paginate: PaginateDto,
  ): Promise<PaginateResultDto> {
    return this.expenseService.getAllUserExpenses(userId, paginate);
  }

  @Get(':id')
  getUserExpenseById(
    @GetUserId() userId: number,
    @Param('id') expenseId: number,
  ) {
    return this.expenseService.getUserExpenseById(userId, expenseId);
  }

  @Post()
  createExpense(@GetUserId() userId: number, @Body() dto: CreateExpenseDto) {
    console.log('dto', dto);
    return this.expenseService.createExpense(userId, dto);
  }

  @Patch(':id')
  updateUSerExpenseById(
    @GetUserId() userId: number,
    @Param('id') expenseId: number,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expenseService.updateUserExpenseById(userId, expenseId, dto);
  }

  @Delete(':id')
  deleteUserExpenseById(
    @GetUserId() userId: number,
    @Param('id') expenseId: number,
  ) {
    return this.expenseService.getUserExpenseById(userId, expenseId);
  }
}
