import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from "@nestjs/graphql";
import { AuthorizationGuard } from "src/http/auth/authorization.guard";
import { AuthUser, CurrentUser } from "src/http/auth/current-user";
import { CustomersService } from "src/services/customers.service";
import { PurchasesService } from "src/services/purchases.service";
import { Customer } from "../models/customer";

@Resolver(() => Customer)
export class CustomersResolver {

  constructor(
    private customersService: CustomersService,
    private purchasesService: PurchasesService
  ) { }


  @Query(() => Customer)
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: AuthUser ) {
    return this.customersService.getCustomerByAuthUserId(user.sub);
  }

  @ResolveField()
  @UseGuards(AuthorizationGuard)
  purchases(@Parent() customer: Customer) {
    return this.purchasesService.listAllFromCustomer(customer.id)
  }

  // reference appoints to the key field on the directive of customer/student graphQL model.
  @ResolveReference()
  resolveReferrence(reference: { authUserId: string }) {
    return this.customersService.getCustomerByAuthUserId(reference.authUserId)
  }
}